const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const activeUsers = new Map(); // socketId -> { userId, userName, currentChat }
const activeChatRooms = new Map(); // chatId -> { users: Set, messages: [] }
const userSockets = new Map(); // userId -> socketId

// Utility functions
function generateChatId(userId1, userId2) {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}:${sortedIds[1]}`;
}

function broadcastToRoom(chatId, message, excludeSocketId = null) {
  const room = activeChatRooms.get(chatId);
  if (room) {
    room.users.forEach((userId) => {
      const socketId = userSockets.get(userId);
      if (socketId && socketId !== excludeSocketId) {
        io.to(socketId).emit("message", message);
      }
    });
  }
}

function getUserCount() {
  return activeUsers.size;
}

function getOnlineUsersList() {
  const users = [];
  activeUsers.forEach((user, socketId) => {
    users.push({
      userId: user.userId,
      userName: user.userName,
      joinedAt: user.joinedAt,
      currentChat: user.currentChat,
      status: user.currentChat ? "in-chat" : "available",
    });
  });
  return users;
}

function broadcastOnlineUsers() {
  const onlineUsers = getOnlineUsersList();
  io.emit("online_users_update", {
    users: onlineUsers,
    count: onlineUsers.length,
  });
}

// Basic HTTP endpoint for health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    activeUsers: getUserCount(),
    activeChatRooms: activeChatRooms.size,
    timestamp: new Date().toISOString(),
  });
});

// Get online users list
app.get("/online-users", (req, res) => {
  res.json({
    users: getOnlineUsersList(),
    count: getUserCount(),
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // User registration
  socket.on("register", (data) => {
    const { userId, userName } = data;

    // Check if user is already registered to prevent duplicates
    if (userSockets.has(userId)) {
      const existingSocketId = userSockets.get(userId);
      activeUsers.delete(existingSocketId);
    }

    // Store user info
    activeUsers.set(socket.id, {
      userId,
      userName: userName || `User${userId.slice(-4)}`,
      currentChat: null,
      joinedAt: new Date(),
    });

    userSockets.set(userId, socket.id);

    console.log(`User registered: ${userName} (${userId})`);

    // Send confirmation
    socket.emit("registration_success", {
      userId,
      userName: userName || `User${userId.slice(-4)}`,
      serverTime: new Date().toISOString(),
    });

    // Broadcast updated user list to everyone (including new user)
    broadcastOnlineUsers();
  });

  // Join chat room
  socket.on("join_chat", (data) => {
    const { chatId, userId, targetUserId } = data;
    const user = activeUsers.get(socket.id);

    if (!user) {
      socket.emit("error", { message: "User not registered" });
      return;
    }

    // Create or get chat room
    if (!activeChatRooms.has(chatId)) {
      activeChatRooms.set(chatId, {
        users: new Set(),
        messages: [],
        createdAt: new Date(),
      });
    }

    const chatRoom = activeChatRooms.get(chatId);
    chatRoom.users.add(userId);

    // Set current chat for status purposes (but don't block other chats)
    user.currentChat = chatId;

    console.log(`User ${user.userName} joined chat ${chatId}`);

    // Join socket room for Socket.IO room management
    socket.join(chatId);

    // Broadcast updated online users (status change)
    broadcastOnlineUsers();

    // Notify other users in the chat
    socket.to(chatId).emit("user_joined", {
      userId,
      userName: user.userName,
      chatId,
      timestamp: new Date().toISOString(),
    });

    // Send recent messages to the user
    socket.emit("chat_history", {
      chatId,
      messages: chatRoom.messages.slice(-50), // Send last 50 messages
    });

    // Send join confirmation
    socket.emit("chat_joined", {
      chatId,
      participants: Array.from(chatRoom.users),
      messageCount: chatRoom.messages.length,
    });
  });

  // Send message
  socket.on("send_message", (data) => {
    const { chatId, messageId, text, sender, timestamp } = data;
    const user = activeUsers.get(socket.id);

    if (!user) {
      socket.emit("error", { message: "User not registered" });
      return;
    }

    const chatRoom = activeChatRooms.get(chatId);
    if (!chatRoom) {
      socket.emit("error", { message: "Chat room not found" });
      return;
    }

    // Check if user is actually in this chat room
    if (!chatRoom.users.has(sender)) {
      socket.emit("error", { message: "User not in this chat room" });
      return;
    }

    // Create message object
    const message = {
      messageId,
      text,
      sender,
      senderName: user.userName,
      timestamp,
      chatId,
    };

    // Store message in room
    chatRoom.messages.push(message);

    // Keep only last 1000 messages per room
    if (chatRoom.messages.length > 1000) {
      chatRoom.messages = chatRoom.messages.slice(-1000);
    }

    console.log(`Message from ${user.userName} in ${chatId}: ${text}`);

    // Broadcast to all users in the chat room
    io.to(chatId).emit("message", {
      type: "message",
      messageId,
      text,
      sender,
      senderName: user.userName,
      timestamp,
      chatId,
    });
  });

  // Leave chat
  socket.on("leave_chat", (data) => {
    const { chatId, userId } = data;
    const user = activeUsers.get(socket.id);

    if (user && chatId) {
      socket.leave(chatId);

      const chatRoom = activeChatRooms.get(chatId);
      if (chatRoom) {
        chatRoom.users.delete(userId);

        // If room is empty, clean it up after 5 minutes
        if (chatRoom.users.size === 0) {
          setTimeout(() => {
            const room = activeChatRooms.get(chatId);
            if (room && room.users.size === 0) {
              activeChatRooms.delete(chatId);
              console.log(`Cleaned up empty chat room: ${chatId}`);
            }
          }, 5 * 60 * 1000); // 5 minutes
        }
      }

      user.currentChat = null;

      // Broadcast updated online users (status change)
      broadcastOnlineUsers();

      // Notify other users
      socket.to(chatId).emit("user_left", {
        userId,
        userName: user.userName,
        chatId,
        timestamp: new Date().toISOString(),
      });

      console.log(`User ${user.userName} left chat ${chatId}`);
    }
  });

  // Typing indicator
  socket.on("typing_start", (data) => {
    const { chatId } = data;
    const user = activeUsers.get(socket.id);

    if (user && user.currentChat === chatId) {
      socket.to(chatId).emit("user_typing", {
        userId: user.userId,
        userName: user.userName,
        chatId,
      });
    }
  });

  socket.on("typing_stop", (data) => {
    const { chatId } = data;
    const user = activeUsers.get(socket.id);

    if (user && user.currentChat === chatId) {
      socket.to(chatId).emit("user_stopped_typing", {
        userId: user.userId,
        userName: user.userName,
        chatId,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);

    if (user) {
      console.log(`User disconnected: ${user.userName} (${user.userId})`);

      // Remove from active users
      activeUsers.delete(socket.id);
      userSockets.delete(user.userId);

      // Leave current chat if any
      if (user.currentChat) {
        const chatRoom = activeChatRooms.get(user.currentChat);
        if (chatRoom) {
          chatRoom.users.delete(user.userId);

          // Notify other users in the chat
          socket.to(user.currentChat).emit("user_left", {
            userId: user.userId,
            userName: user.userName,
            chatId: user.currentChat,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Broadcast updated user count
      io.emit("user_count_update", { count: getUserCount() });

      // Broadcast updated online users list
      broadcastOnlineUsers();
    }

    console.log(`Connection closed: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 SpeakMind Chat Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
