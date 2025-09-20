import { useState } from 'react'
import type { Screen } from '../App'
import { IoChevronBack } from 'react-icons/io5';

interface SharingScreenProps {
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

interface ForumReply {
  id: string
  content: string
  author: string
  timestamp: string
  likes: number
  isLiked: boolean
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

export default function SharingScreen({ onNavigate }: SharingScreenProps) {
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
      <div className="min-h-screen bg-white relative pb-20 flex flex-col">
        {/* Chat Header */}
        <div className="px-4 pt-12 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedChat(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← 
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedChat.participant}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Available for support</span>
                  <button className="text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isOwn && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                    👤
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isOwn 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-purple-50 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
                {message.isOwn && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm ml-3 mt-1 flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-full flex items-center px-4 py-3">
            <input
              type="text"
              placeholder="Ask anything"
              className="flex-1 px-2 py-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-sm"
            />
            <button className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors ml-2 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Sharing</h1>
          <p className="text-sm text-gray-500">Connect with the community</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Scrollable Content Container */}
      <div className="px-4 pb-32 overflow-y-auto" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'forum' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Support Chat
            </button>
          </div>
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            {/* Forum Posts */}
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{post.author}</span>
                          <span className="text-gray-500 text-sm ml-2">{post.timestamp}</span>
                        </div>
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                            post.isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
                          }`}
                        >
                          <span>{post.isLiked ? '❤️' : '🤍'}</span>
                          <span>{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-13">
                    <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-13">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded-xl ml-13">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                👤
                              </div>
                              <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                              <span className="text-gray-500 text-xs">{reply.timestamp}</span>
                            </div>
                            <button
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className={`flex items-center space-x-1 text-xs ${
                                reply.isLiked ? 'text-rose-400' : 'text-gray-400 hover:text-rose-400'
                              }`}
                            >
                              <span>{reply.isLiked ? '❤️' : '🤍'}</span>
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm">{reply.content}</p>
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
          <div className="pb-6">
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                        👤
                      </div>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
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
          </div>
        )}

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Create New Post</h3>
              
              <input
                type="text"
                placeholder="Post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-purple-500"
              />
              
              <textarea
                placeholder="Share your thoughts, experiences, or questions..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-purple-500 resize-none"
              />
              
              <input
                type="text"
                placeholder="Tags (separate with commas)"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
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
                  className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Share Experience Button above navbar */}
      {activeTab === 'forum' && (
        <div className="fixed left-6 right-6 bottom-24 z-50 max-w-sm mx-auto">
          <button
            onClick={() => setShowNewPost(true)}
            className="w-full py-3 px-6 bg-purple-500 text-white rounded-2xl font-medium shadow-lg hover:bg-purple-600 transition-colors text-sm"
          >
            Share your Experience
          </button>
        </div>
      )}
    </div>
  )
}