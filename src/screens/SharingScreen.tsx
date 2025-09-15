import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Screen } from '../App'

interface SharingScreenProps {
  onNavigate: (screen: Screen) => void
}

interface Message {
  id: string
  text: string
  sender: string
  timestamp: number
  isOwn: boolean
  pending?: boolean // Add pending status for sent messages
}

interface ChatSession {
  friendId: number
  friendName: string
  messages: Message[]
  isActive: boolean
}

interface OnlineUser {
  userId: string
  userName: string
  joinedAt: string
  currentChat: string | null
  status: 'available' | 'in-chat'
}

export default function SharingScreen({ onNavigate: _ }: SharingScreenProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentUserId] = useState(() => {
    let userId = localStorage.getItem('speakmind_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('speakmind_user_id', userId)
    }
    return userId
  })
  const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [showOnlineUsers, setShowOnlineUsers] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Socket.IO connection
  useEffect(() => {
    const connectSocket = () => {
      try {
        // Connect to Socket.IO server
        const newSocket = io('http://localhost:8080', {
          transports: ['websocket'],
          upgrade: true
        })
        
        newSocket.on('connect', () => {
          console.log('Connected to chat server')
          setIsConnected(true)
          setSocket(newSocket)
          
          // Register user with server
          newSocket.emit('register', {
            userId: currentUserId,
            userName: `User${currentUserId.slice(-4)}`
          })
        })

        newSocket.on('registration_success', (data) => {
          console.log('Registration successful:', data)
        })

        newSocket.on('message', (data) => {
          handleSocketMessage(data)
        })

        newSocket.on('user_joined', (data) => {
          console.log(`${data.userName} joined the chat`)
        })

        newSocket.on('user_left', (data) => {
          console.log(`${data.userName} left the chat`)
        })

        newSocket.on('online_users_update', (data) => {
          console.log('Online users updated:', data)
          setOnlineUsers(data.users.filter((user: OnlineUser) => user.userId !== currentUserId))
        })

        newSocket.on('user_count_update', (data) => {
          console.log('User count updated:', data.count)
        })

        newSocket.on('chat_history', (data) => {
          console.log('Received chat history:', data)
          // Update the active chat session if it matches
          setActiveChatSession(prev => {
            if (prev) {
              const expectedChatId = generateChatId(prev.friendId, currentUserId)
              if (data.chatId === expectedChatId) {
                const serverMessages = data.messages.map((msg: any) => ({
                  id: msg.messageId,
                  text: msg.text,
                  sender: msg.sender,
                  timestamp: msg.timestamp,
                  isOwn: msg.sender === currentUserId,
                  pending: false // Server messages are confirmed
                }))

                return { ...prev, messages: serverMessages }
              }
            }
            return prev
          })
        })

        newSocket.on('disconnect', () => {
          console.log('Disconnected from chat server')
          setIsConnected(false)
          setSocket(null)
          
          // Try to reconnect after 3 seconds
          setTimeout(connectSocket, 3000)
        })

        newSocket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error)
          setIsConnected(false)
        })

        newSocket.on('error', (error) => {
          console.error('Socket.IO error:', error)
        })

        newSocket.on('chat_joined', (data) => {
          console.log('Successfully joined chat:', data)
        })

      } catch (error) {
        console.error('Failed to connect to Socket.IO server:', error)
        // Fallback to localStorage-only mode
        setIsConnected(false)
      }
    }

    connectSocket()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [currentUserId])

  const handleSocketMessage = (data: any) => {
    console.log('Received message:', data)
    
    if (data.type === 'message') {
      // Find which chat session this message belongs to
      setActiveChatSession(prev => {
        if (prev) {
          const expectedChatId = generateChatId(prev.friendId, currentUserId)
          console.log('Expected chatId:', expectedChatId, 'Received chatId:', data.chatId)
          
          if (data.chatId === expectedChatId) {
            // Check if this is our own message coming back from server
            if (data.sender === currentUserId) {
              // Find and update the pending message
              const updatedMessages = prev.messages.map(msg => 
                msg.id === data.messageId 
                  ? { ...msg, pending: false } 
                  : msg
              )
              
              // If message not found, it means we didn't send it (shouldn't happen)
              const messageExists = prev.messages.some(msg => msg.id === data.messageId)
              if (!messageExists) {
                console.warn('Received our own message that we did not send:', data)
              }
              
              const updatedSession = { ...prev, messages: updatedMessages }
              saveChatToLocalStorage(updatedSession)
              return updatedSession
            } else {
              // This is a message from another user
              const newMessage: Message = {
                id: data.messageId,
                text: data.text,
                sender: data.sender,
                timestamp: data.timestamp,
                isOwn: false,
                pending: false
              }
              
              // Check if message already exists (prevent duplicates)
              const messageExists = prev.messages.some(msg => msg.id === data.messageId)
              if (!messageExists) {
                console.log('Adding new message from other user:', newMessage)
                
                const updatedSession = {
                  ...prev,
                  messages: [...prev.messages, newMessage]
                }
                saveChatToLocalStorage(updatedSession)
                return updatedSession
              } else {
                console.log('Message already exists, skipping duplicate:', data.messageId)
              }
            }
          }
        }
        return prev
      })
    }
  }

  const saveChatToLocalStorage = (chatSession: ChatSession) => {
    const chatKey = `chat_${chatSession.friendId}`
    localStorage.setItem(chatKey, JSON.stringify(chatSession))
  }

  const loadChatFromLocalStorage = (friendId: number): ChatSession | null => {
    const chatKey = `chat_${friendId}`
    const savedChat = localStorage.getItem(chatKey)
    return savedChat ? JSON.parse(savedChat) : null
  }

  const generateChatId = (friendId: number, userId: string): string => {
    // Extract numeric part from userId or use friendId if extraction fails
    const userNumericId = parseInt(userId.split('_')[1]) || friendId + 1000
    const sortedIds = [friendId, userNumericId].sort((a, b) => a - b)
    return `${sortedIds[0]}:${sortedIds[1]}`
  }

  const startChatWithUser = (user: OnlineUser) => {
    // Extract numeric ID from user's userId for chat room creation
    const friendId = parseInt(user.userId.split('_')[1]) || Math.floor(Math.random() * 1000)
    
    // Load existing chat or create new one
    let chatSession = loadChatFromLocalStorage(friendId)
    
    if (!chatSession) {
      chatSession = {
        friendId: friendId,
        friendName: user.userName,
        messages: [],
        isActive: true
      }
    } else {
      chatSession.isActive = true
    }

    setActiveChatSession(chatSession)

    // Join chat room via Socket.IO if connected
    if (socket && isConnected) {
      const chatId = generateChatId(friendId, currentUserId)
      console.log('Starting chat with ID:', chatId)
      
      socket.emit('join_chat', {
        chatId,
        userId: currentUserId,
        targetUserId: user.userId
      })
    }
  }

  const sendMessage = (text: string) => {
    if (!activeChatSession || !text.trim()) return

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      sender: currentUserId,
      timestamp: Date.now(),
      isOwn: true,
      pending: isConnected // Mark as pending if connected to server
    }

    // Always add to local state for immediate UI feedback
    const updatedSession = {
      ...activeChatSession,
      messages: [...activeChatSession.messages, message]
    }
    
    setActiveChatSession(updatedSession)
    saveChatToLocalStorage(updatedSession)

    // Send via Socket.IO if connected
    if (socket && isConnected) {
      const chatId = generateChatId(activeChatSession.friendId, currentUserId)
      console.log('Sending message to chatId:', chatId)
      
      socket.emit('send_message', {
        chatId,
        messageId: message.id,
        text: message.text,
        sender: currentUserId,
        timestamp: message.timestamp
      })
    }
  }

  const closeChat = () => {
    if (activeChatSession) {
      const updatedSession = { ...activeChatSession, isActive: false }
      saveChatToLocalStorage(updatedSession)
      setActiveChatSession(null)
      
      // Leave chat room
      if (socket && isConnected) {
        const chatId = generateChatId(activeChatSession.friendId, currentUserId)
        socket.emit('leave_chat', {
          chatId,
          userId: currentUserId
        })
      }
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChatSession?.messages])

  const [messageInput, setMessageInput] = useState('')

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput('') // Clear input immediately after sending
    }
  }

  // If in active chat, show chat interface
  if (activeChatSession) {
    return (
      <div className="min-h-screen bg-light-bg pb-24 flex flex-col">
        {/* Chat Header */}
        <div className="gradient-bg px-6 pt-12 pb-4 rounded-b-5xl">
          <div className="flex items-center space-x-4 text-white">
            <button 
              onClick={closeChat}
              className="text-white hover:text-white/80"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <h2 className="font-semibold">{activeChatSession.friendName}</h2>
                <p className="text-sm text-white/80">
                  {isConnected ? 'Online' : 'Offline (messages saved locally)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {activeChatSession.messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Start a conversation with {activeChatSession.friendName}</p>
              </div>
            ) : (
              activeChatSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isOwn
                        ? `bg-primary-purple text-white ${message.pending ? 'opacity-70' : ''}`
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${message.isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.isOwn && (
                        <span className={`text-xs ml-2 ${message.pending ? 'text-white/50' : 'text-white/70'}`}>
                          {message.pending ? '⏱️' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 bg-white border-t">
          <div className="flex space-x-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && messageInput.trim()) {
                  handleSendMessage()
                }
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-purple"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="px-6 py-2 bg-primary-purple text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-purple/90 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">Support Community</h1>
          <p className="text-white/80 text-sm">
            Connect with others on similar journeys
            {!isConnected && ' (Offline mode - messages saved locally)'}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Connection Status */}
        {!isConnected && (
          <div className="card mb-4 bg-yellow-50 border border-yellow-200">
            <div className="flex items-center space-x-2 text-yellow-800">
              <span>⚠️</span>
              <p className="text-sm">
                Unable to connect to chat server. Messages will be saved locally.
              </p>
            </div>
          </div>
        )}

        {/* Online Users Toggle */}
        {isConnected && (
          <div className="card mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Online Users ({onlineUsers.length})
              </h3>
              <button
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                className="text-primary-purple hover:text-primary-purple/80 text-sm font-medium"
              >
                {showOnlineUsers ? 'Hide' : 'Show'} Online
              </button>
            </div>
            
            {showOnlineUsers && (
              <div className="mt-4 space-y-2">
                {onlineUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No other users online</p>
                ) : (
                  onlineUsers.map((user) => (
                    <div key={user.userId} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <div className="w-8 h-8 bg-primary-purple/20 rounded-full flex items-center justify-center text-sm">
                          👤
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                          user.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{user.userName}</h4>
                        <p className="text-xs text-gray-500">
                          {user.status === 'available' ? 'Available' : 'In chat'}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => startChatWithUser(user)}
                        className="px-3 py-1 bg-primary-purple text-white rounded-full text-xs font-medium hover:bg-primary-purple/90 transition-colors"
                      >
                        Chat
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* How it Works Section */}
        <div className="card mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">How Anonymous Chat Works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-green-500">🔒</span>
              <p>Your identity remains anonymous - only display names are shown</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500">💬</span>
              <p>Real-time messaging when both users are online</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-purple-500">💾</span>
              <p>Messages saved locally for your reference</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-orange-500">🤝</span>
              <p>Connect with others facing similar challenges</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-cyan-500">👥</span>
              <p>See who's online and available to chat right now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}