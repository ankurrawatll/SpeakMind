import { useState, useEffect } from 'react'
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import type { Screen } from '../App'

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

interface Event {
  id: string
  title: string
  address: string
  city: string
  dateTime: Date
  creatorId: string
  creatorName: string
  createdAt: Date
}

// Major cities in India
const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot'
]


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

export default function SharingScreen({ onNavigate: _ }: SharingScreenProps) {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'forum' | 'chat' | 'events'>('forum')
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTags, setNewPostTags] = useState('')

  // Events state
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai')
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventAddress, setNewEventAddress] = useState('')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventTime, setNewEventTime] = useState('')

  const [conversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS)
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_POSTS)

  // Fetch events for selected city
  useEffect(() => {
    console.log('Fetching events for city:', selectedCity)
    
    // Clear events first to ensure fresh data
    setEvents([])
    
    const eventsRef = collection(db, 'events')
    const q = query(eventsRef, where('city', '==', selectedCity))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents: Event[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        console.log('Event data:', data.title, 'City:', data.city)
        fetchedEvents.push({
          id: doc.id,
          title: data.title,
          address: data.address,
          city: data.city,
          dateTime: data.dateTime.toDate(),
          creatorId: data.creatorId,
          creatorName: data.creatorName,
          createdAt: data.createdAt.toDate()
        })
      })
      console.log('Total events fetched:', fetchedEvents.length)
      setEvents(fetchedEvents)
    }, (error) => {
      console.error('Error fetching events:', error)
    })

    return () => {
      console.log('Cleaning up listener for city:', selectedCity)
      unsubscribe()
    }
  }, [selectedCity])

  // Auto-delete expired events
  useEffect(() => {
    const checkAndDeleteExpiredEvents = async () => {
      const now = new Date()
      events.forEach(async (event) => {
        if (event.dateTime < now) {
          try {
            await deleteDoc(doc(db, 'events', event.id))
          } catch (error) {
            console.error('Error deleting expired event:', error)
          }
        }
      })
    }

    const interval = setInterval(checkAndDeleteExpiredEvents, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [events])

  const handleCreateEvent = async () => {
    if (!currentUser) {
      alert('Please log in to create events')
      return
    }

    if (!newEventTitle.trim() || !newEventAddress.trim() || !newEventDate || !newEventTime) {
      alert('Please fill in all fields')
      return
    }

    try {
      const dateTimeString = `${newEventDate}T${newEventTime}`
      const eventDateTime = new Date(dateTimeString)

      if (eventDateTime <= new Date()) {
        alert('Event date and time must be in the future')
        return
      }

      await addDoc(collection(db, 'events'), {
        title: newEventTitle.trim(),
        address: newEventAddress.trim(),
        city: selectedCity,
        dateTime: Timestamp.fromDate(eventDateTime),
        creatorId: currentUser.uid,
        creatorName: currentUser.displayName || currentUser.email || 'Anonymous',
        createdAt: Timestamp.now()
      })

      // Clear form and close modal
      setNewEventTitle('')
      setNewEventAddress('')
      setNewEventDate('')
      setNewEventTime('')
      setShowNewEvent(false)
      
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    }
  }

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
      <div className="min-h-screen relative pb-24 flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/18071149/pexels-photo-18071149.jpeg" alt="Community background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Chat Header */}
        <div className="relative z-10 px-6 pt-12 pb-4">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center space-x-4 text-white">
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
        <div className="relative z-10 flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.isOwn ? 'bg-primary-purple text-white' : 'bg-white/30 backdrop-blur text-white'}`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-white/70'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="relative z-10 px-6 py-4">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-full flex items-center px-3 py-2">
            <input
              type="text"
              placeholder="Type a supportive message..."
              className="flex-1 px-3 py-2 bg-transparent text-white placeholder-white/70 focus:outline-none"
            />
            <button className="px-4 py-2 bg-primary-purple text-white rounded-full hover:bg-primary-purple/90 transition-colors">
              Send
            </button>
          </div>
          <p className="text-xs text-white/70 mt-2 text-center">
            💡 This is a prototype - messages are for demonstration only
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.pexels.com/photos/18071149/pexels-photo-18071149.jpeg" alt="Community background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white">
          <h1 className="text-2xl font-bold mb-1">Community</h1>
          <p className="text-white/80 text-sm">Connect, share, and support each other</p>
        </div>
      </div>

      <div className="relative z-10 px-6 -mt-2">
        {/* Tab Navigation */}
        <div className="mb-4">
          <div className="flex bg-white/15 backdrop-blur-xl border border-white/20 rounded-full p-1">
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-colors ${activeTab === 'forum' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-colors ${activeTab === 'chat' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
            >
              Support Chat
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-colors ${activeTab === 'events' ? 'bg-white text-gray-900 shadow' : 'text-white/80 hover:text-white'}`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            {/* New Post Button */}
            <div className="mb-4 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowNewPost(true)}
                  className="px-4 py-2 bg-primary-purple text-white rounded-full hover:bg-primary-purple/90 transition-colors"
                >
                  ✏️ Share Your Experience
                </button>
                <div className="text-white/80 text-sm">
                  <button className="px-3 py-1 rounded-full hover:bg-white/10">Top</button>
                  <button className="px-3 py-1 rounded-full hover:bg-white/10">Latest</button>
                </div>
              </div>
            </div>

            {/* New Post Modal */}
            {showNewPost && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white/95 rounded-2xl w-full max-w-md p-6 backdrop-blur-md">
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
                <div key={post.id} className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                        👤
                      </div>
                      <div>
                        <span className="font-medium">{post.author}</span>
                        <span className="text-white/70 text-sm ml-2">{post.timestamp}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                        post.isLiked ? 'text-rose-400' : 'text-white/70 hover:text-rose-300'
                      }`}
                    >
                      <span>{post.isLiked ? '❤️' : '🤍'}</span>
                      <span>{post.likes}</span>
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2 text-lg">{post.title}</h3>
                  <p className="text-white/90 mb-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/15 text-white text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="border-t border-white/20 pt-4 space-y-3">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-white/10 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                👤
                              </div>
                              <span className="font-medium text-white text-sm">{reply.author}</span>
                              <span className="text-white/70 text-xs">{reply.timestamp}</span>
                            </div>
                            <button
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className={`flex items-center space-x-1 text-xs ${
                                reply.isLiked ? 'text-rose-300' : 'text-white/70 hover:text-rose-300'
                              }`}
                            >
                              <span>{reply.isLiked ? '❤️' : '🤍'}</span>
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                          <p className="text-white/90 text-sm">{reply.content}</p>
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
            <div className="mb-4 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white">
              <h3 className="text-lg font-semibold mb-1">Support Conversations</h3>
              <p className="text-sm text-white/80">Connect one-on-one with others who understand your journey</p>
            </div>

            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 cursor-pointer transition-colors hover:bg-white/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg text-white">
                        👤
                      </div>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{conversation.participant}</h4>
                        <span className="text-xs text-white/70">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-white/80 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white">
              <h3 className="text-sm font-semibold mb-2">💡 About Support Chat</h3>
              <div className="space-y-2 text-xs text-white/80">
                <p>• Anonymous conversations with others facing similar challenges</p>
                <p>• Share experiences and coping strategies</p>
                <p>• This is a prototype - real implementation would include matching algorithms</p>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {/* City Selector */}
            <div className="mb-4 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <label className="block text-white text-sm font-semibold mb-2">📍 Select City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50 backdrop-blur"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                  appearance: 'none'
                }}
              >
                {INDIAN_CITIES.map((city) => (
                  <option key={city} value={city} className="bg-gray-800 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Events List */}
            <div className="space-y-4 pb-20">
              {events.length === 0 ? (
                <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center text-white">
                  <div className="text-5xl mb-3">📅</div>
                  <h3 className="font-semibold mb-2">No Events Yet</h3>
                  <p className="text-white/80 text-sm">Be the first to create an event in {selectedCity}!</p>
                </div>
              ) : (
                events
                  .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
                  .map((event) => (
                    <div key={event.id} className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                              {event.city}
                            </span>
                          </div>
                          <div className="flex items-center text-white/80 text-sm mb-2">
                            <span className="mr-2">👤</span>
                            <span>Organized by {event.creatorName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-white/90 text-sm">
                          <span className="mr-2">📍</span>
                          <span>{event.address}</span>
                        </div>
                        <div className="flex items-center text-white/90 text-sm">
                          <span className="mr-2">📅</span>
                          <span>{event.dateTime.toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center text-white/90 text-sm">
                          <span className="mr-2">🕐</span>
                          <span>{event.dateTime.toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <span className="text-xs text-white/70">
                          Posted {event.createdAt.toLocaleDateString()}
                        </span>
                        {currentUser && event.creatorId === currentUser.uid && (
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                            Your Event
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white">
              <h3 className="text-sm font-semibold mb-2">💡 About Events</h3>
              <div className="space-y-2 text-xs text-white/80">
                <p>• Connect with others in your city for real-life meetups</p>
                <p>• Share mental wellness activities and group sessions</p>
                <p>• Events automatically expire after the scheduled time</p>
              </div>
            </div>

            {/* Floating Add Button */}
            <button
              onClick={() => setShowNewEvent(true)}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary-purple text-white rounded-full shadow-lg hover:bg-primary-purple/90 transition-all hover:scale-110 flex items-center justify-center text-3xl font-light z-40 leading-none"
              style={{ boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)' }}
            >
              <span className="block leading-none">+</span>
            </button>

            {/* New Event Modal */}
            {showNewEvent && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white/95 rounded-2xl w-full max-w-sm p-5 backdrop-blur-md max-h-[90vh] overflow-y-auto">
                  <h3 className="text-base font-semibold mb-3">Create New Event</h3>
                  
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Title</label>
                      <input
                        type="text"
                        placeholder="E.g., Meditation Group Session"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-purple"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        placeholder="Full address with landmarks"
                        value={newEventAddress}
                        onChange={(e) => setNewEventAddress(e.target.value)}
                        rows={2}
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-purple resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                      <div className="px-2.5 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                        {selectedCity}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-purple"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-purple"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        setShowNewEvent(false)
                        setNewEventTitle('')
                        setNewEventAddress('')
                        setNewEventDate('')
                        setNewEventTime('')
                      }}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateEvent}
                      className="flex-1 py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/90 transition-colors"
                    >
                      Create Event
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}