# SpeakMind Chat Server

WebSocket server for real-time chat functionality in the SpeakMind app.

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

## Server Information

- **Port:** 8080 (default)
- **WebSocket URL:** `ws://localhost:8080`
- **Health Check:** `http://localhost:8080/health`

## Features

- ✅ Real-time one-on-one messaging
- ✅ Anonymous user system (session-based)
- ✅ Chat room management
- ✅ Message persistence (in-memory)
- ✅ Connection status tracking
- ✅ Typing indicators
- ✅ User join/leave notifications
- ✅ Auto cleanup of empty rooms

## API Endpoints

### WebSocket Events

**Client → Server:**

- `register` - Register user with server
- `join_chat` - Join a specific chat room
- `send_message` - Send message to chat room
- `leave_chat` - Leave current chat room
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

**Server → Client:**

- `registration_success` - Confirm user registration
- `message` - Receive chat message
- `chat_history` - Receive recent messages when joining
- `user_joined` - User joined the chat
- `user_left` - User left the chat
- `user_typing` - Someone is typing
- `user_stopped_typing` - Someone stopped typing
- `user_count_update` - Active user count changed

### HTTP Endpoints

- `GET /health` - Server status and statistics

## Environment Variables

- `PORT` - Server port (default: 8080)

## Development Notes

- Messages are stored in memory (will be lost on restart)
- Rooms auto-cleanup after 5 minutes of inactivity
- Maximum 1000 messages per room
- CORS configured for `http://localhost:5173` (Vite default)

## Production Deployment

For production, consider:

- Adding database persistence
- Implementing rate limiting
- Adding authentication
- Setting up load balancing
- Configuring proper CORS origins
