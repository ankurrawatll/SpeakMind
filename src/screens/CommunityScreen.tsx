import { useState } from 'react'
import type { Screen } from '../App'

interface CommunityScreenProps {
  onNavigate: (screen: Screen) => void
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  isOwn: boolean
}

interface ChatConversation {
  id: string
  participant: string
  lastMessage: string
  timestamp: string
  unread: number
  messages: ChatMessage[]
}

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  tags: string[]
  likes: number
  replies: ForumReply[]
  isLiked: boolean
}

interface ForumReply {
  id: string
  content: string
  author: string
  timestamp: string
  likes: number
  isLiked: boolean
}

// Mock data for chat conversations
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: '1',
    participant: 'Alex',
    lastMessage: 'Thanks for sharing your experience with meditation...',
    timestamp: '2 min ago',
    unread: 1,
    messages: [
      { id: '1', sender: 'Alex', message: 'Hi! I saw your post about anxiety management. I\'ve been struggling with similar issues.', timestamp: '10:30 AM', isOwn: false },
      { id: '2', sender: 'You', message: 'Hey Alex! I\'m glad you reached out. What techniques have you tried so far?', timestamp: '10:32 AM', isOwn: true },
      { id: '3', sender: 'Alex', message: 'I\'ve tried breathing exercises but find it hard to stay consistent. Any tips?', timestamp: '10:35 AM', isOwn: false },
      { id: '4', sender: 'You', message: 'I found that setting a daily reminder really helped. Start with just 5 minutes.', timestamp: '10:37 AM', isOwn: true },
      { id: '5', sender: 'Alex', message: 'Thanks for sharing your experience with meditation...', timestamp: '10:40 AM', isOwn: false },
    ]
  },
  {
    id: '2',
    participant: 'Jordan',
    lastMessage: 'That\'s a great perspective on self-care',
    timestamp: '1 hour ago',
    unread: 0,
    messages: [
      { id: '1', sender: 'Jordan', message: 'Your journal entry about self-compassion really resonated with me.', timestamp: '9:15 AM', isOwn: false },
      { id: '2', sender: 'You', message: 'Thank you! It took me a while to learn to be kinder to myself.', timestamp: '9:20 AM', isOwn: true },
      { id: '3', sender: 'Jordan', message: 'That\'s a great perspective on self-care', timestamp: '9:25 AM', isOwn: false },
    ]
  },
  {
    id: '3',
    participant: 'Sam',
    lastMessage: 'How do you handle work stress?',
    timestamp: '3 hours ago',
    unread: 2,
    messages: [
      { id: '1', sender: 'Sam', message: 'I noticed you mentioned work-life balance. How do you handle work stress?', timestamp: '7:30 AM', isOwn: false },
    ]
  }
]

// Mock data for forum posts
const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Dealing with Sunday anxiety - anyone else?',
    content: 'Does anyone else get really anxious on Sunday nights thinking about the upcoming work week? I\'ve been trying different strategies but would love to hear what works for others.',
    author: 'MindfulMike',
    timestamp: '2 hours ago',
    tags: ['anxiety', 'work-stress', 'sunday-scaries'],
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: '1',
        content: 'Yes! I call it the "Sunday scaries". What helps me is planning something fun for Sunday evening - like watching a good movie or video calling a friend.',
        author: 'ZenSeeker',
        timestamp: '1 hour ago',
        likes: 8,
        isLiked: true
      },
      {
        id: '2',
        content: 'I prepare for Monday on Friday so I don\'t have to think about work over the weekend. Game changer!',
        author: 'CalmCollector',
        timestamp: '45 min ago',
        likes: 12,
        isLiked: false
      },
      {
        id: '3',
        content: 'Try a Sunday wind-down routine - tea, gentle music, maybe some journaling about what you\'re grateful for from the week.',
        author: 'PeacefulPath',
        timestamp: '30 min ago',
        likes: 6,
        isLiked: false
      }
    ]
  },
  {
    id: '2',
    title: 'Small wins in my mental health journey 🌱',
    content: 'Been working on my mental health for 6 months now. Today I managed to do my morning meditation even though I didn\'t feel like it. Celebrating these small victories!',
    author: 'GrowingDaily',
    timestamp: '5 hours ago',
    tags: ['progress', 'meditation', 'self-care', 'motivation'],
    likes: 47,
    isLiked: true,
    replies: [
      {
        id: '1',
        content: 'This is so inspiring! Those small consistent actions really add up over time. Proud of you! 💪',
        author: 'SupportiveSoul',
        timestamp: '4 hours ago',
        likes: 15,
        isLiked: false
      },
      {
        id: '2',
        content: 'Yes! I\'ve learned that showing up even when you don\'t feel like it is actually the most important time to do it.',
        author: 'WisdomSeeker',
        timestamp: '3 hours ago',
        likes: 9,
        isLiked: true
      }
    ]
  },
  {
    id: '3',
    title: 'Therapist recommendations for social anxiety?',
    content: 'I\'m finally ready to seek professional help for my social anxiety. Does anyone have recommendations for finding the right therapist? What should I look for?',
    author: 'TakingSteps',
    timestamp: '1 day ago',
    tags: ['therapy', 'social-anxiety', 'professional-help'],
    likes: 18,
    isLiked: false,
    replies: [
      {
        id: '1',
        content: 'Psychology Today has a great therapist finder. Look for someone who specializes in anxiety disorders and uses CBT or exposure therapy.',
        author: 'TherapyAdvocate',
        timestamp: '1 day ago',
        likes: 22,
        isLiked: false
      },
      {
        id: '2',
        content: 'Don\'t be afraid to schedule consultations with a few different therapists. The therapeutic relationship is so important!',
        author: 'HealingJourney',
        timestamp: '20 hours ago',
        likes: 14,
        isLiked: false
      }
    ]
  }
]

export default function CommunityScreen({ onNavigate }: CommunityScreenProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('forum')
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTags, setNewPostTags] = useState('')

  const [conversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS)
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_POSTS)

  const handleLikePost = (postId: string) => {
    setForumPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  const handleLikeReply = (postId: string, replyId: string) => {
    setForumPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                  : reply
              )
            }
          : post
      )
    )
  }

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      const newPost: ForumPost = {
        id: String(Date.now()),
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        author: 'You',
        timestamp: 'Just now',
        tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likes: 0,
        isLiked: false,
        replies: []
      }
      
      setForumPosts([newPost, ...forumPosts])
      setNewPostTitle('')
      setNewPostContent('')
      setNewPostTags('')
      setShowNewPost(false)
    }
  }

  // Chat interface
  if (selectedChat) {
    return (
      <div className="min-h-screen bg-light-bg pb-24 flex flex-col">
        {/* Chat Header */}
        <div className="gradient-bg px-6 pt-12 pb-4 rounded-b-5xl">
          <div className="flex items-center space-x-4 text-white">
            <button 
              onClick={() => setSelectedChat(null)}
              className="text-white hover:text-white/80"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <h2 className="font-semibold">{selectedChat.participant}</h2>
                <p className="text-sm text-white/80">Available for support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? 'bg-primary-purple text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 bg-white border-t">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type a supportive message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-purple"
            />
            <button className="px-6 py-2 bg-primary-purple text-white rounded-full hover:bg-primary-purple/90 transition-colors">
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 This is a prototype - messages are for demonstration only
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">Community</h1>
          <p className="text-white/80 text-sm">
            Connect, share, and support each other
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Tab Navigation */}
        <div className="card mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'forum'
                  ? 'bg-white text-primary-purple shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white text-primary-purple shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Support Chat
            </button>
          </div>
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            {/* New Post Button */}
            <div className="card mb-4">
              <button
                onClick={() => setShowNewPost(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/90 transition-colors"
              >
                <span>✏️</span>
                <span className="font-medium">Share Your Experience</span>
              </button>
            </div>

            {/* New Post Modal */}
            {showNewPost && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
                  
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-primary-purple"
                  />
                  
                  <textarea
                    placeholder="Share your thoughts, experiences, or questions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-primary-purple resize-none"
                  />
                  
                  <input
                    type="text"
                    placeholder="Tags (separate with commas)"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-primary-purple"
                  />
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowNewPost(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="flex-1 py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/90 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forum Posts */}
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary-purple/20 flex items-center justify-center text-sm">
                        👤
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{post.author}</span>
                        <span className="text-gray-500 text-sm ml-2">{post.timestamp}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                        post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <span>{post.isLiked ? '❤️' : '🤍'}</span>
                      <span>{post.likes}</span>
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-purple/10 text-primary-purple text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="border-t pt-4 space-y-3">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-primary-purple/20 flex items-center justify-center text-xs">
                                👤
                              </div>
                              <span className="font-medium text-gray-800 text-sm">{reply.author}</span>
                              <span className="text-gray-500 text-xs">{reply.timestamp}</span>
                            </div>
                            <button
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className={`flex items-center space-x-1 text-xs ${
                                reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <span>{reply.isLiked ? '❤️' : '🤍'}</span>
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div>
            <div className="card mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Support Conversations</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect one-on-one with others who understand your journey
              </p>
            </div>

            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className="card hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary-purple/20 flex items-center justify-center text-lg">
                        👤
                      </div>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{conversation.participant}</h4>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">💡 About Support Chat</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p>• Anonymous conversations with others facing similar challenges</p>
                <p>• Share experiences and coping strategies</p>
                <p>• This is a prototype - real implementation would include matching algorithms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}