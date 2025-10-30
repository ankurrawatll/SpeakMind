/**
 * User Context Storage Utility
 * Stores and retrieves user conversation context for personalized video recommendations
 */

export interface UserContext {
  lastConversation: {
    question: string
    answer: string
    timestamp: number
  }[]
  topics: string[]
  mood?: string
  lastUpdated: number
}

const STORAGE_KEY = 'speakmind_user_context'
const MAX_CONTEXT_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Save user conversation context to localStorage
 */
export const saveUserContext = (question: string, answer: string, mood?: string) => {
  try {
    const existing = getUserContext()
    
    // Add new conversation to history (keep last 5)
    const conversation = {
      question,
      answer,
      timestamp: Date.now()
    }
    
    const updatedConversations = [
      ...existing.lastConversation,
      conversation
    ].slice(-5) // Keep only last 5 conversations

    // Extract topics/keywords from the conversation
    const newTopics = extractTopics(question, answer)
    const allTopics = [...new Set([...existing.topics, ...newTopics])].slice(-10) // Keep unique, last 10

    const context: UserContext = {
      lastConversation: updatedConversations,
      topics: allTopics,
      mood: mood || existing.mood,
      lastUpdated: Date.now()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(context))
  } catch (error) {
    console.error('Error saving user context:', error)
  }
}

/**
 * Get user context from localStorage
 */
export const getUserContext = (): UserContext => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return {
        lastConversation: [],
        topics: [],
        lastUpdated: Date.now()
      }
    }

    const context: UserContext = JSON.parse(stored)
    
    // Check if context is too old
    if (Date.now() - context.lastUpdated > MAX_CONTEXT_AGE) {
      clearUserContext()
      return {
        lastConversation: [],
        topics: [],
        lastUpdated: Date.now()
      }
    }

    return context
  } catch (error) {
    console.error('Error getting user context:', error)
    return {
      lastConversation: [],
      topics: [],
      lastUpdated: Date.now()
    }
  }
}

/**
 * Clear user context
 */
export const clearUserContext = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing user context:', error)
  }
}

/**
 * Extract topics/keywords from conversation
 */
const extractTopics = (question: string, answer: string): string[] => {
  const text = `${question} ${answer}`.toLowerCase()
  const topics: string[] = []

  // Common mental health and wellness topics
  const topicPatterns: Record<string, string[]> = {
    'anxiety': ['anxiety', 'anxious', 'worry', 'worried', 'nervous', 'stress', 'stressed'],
    'depression': ['depression', 'depressed', 'sad', 'sadness', 'hopeless', 'down'],
    'relationships': ['relationship', 'partner', 'spouse', 'boyfriend', 'girlfriend', 'marriage', 'divorce', 'breakup', 'conflict'],
    'sleep': ['sleep', 'insomnia', 'sleeping', 'rest', 'tired', 'fatigue', 'exhausted'],
    'focus': ['focus', 'concentration', 'attention', 'distracted', 'productivity'],
    'anger': ['anger', 'angry', 'frustrated', 'irritated', 'rage', 'mad'],
    'grief': ['grief', 'loss', 'death', 'mourning', 'bereavement'],
    'trauma': ['trauma', 'ptsd', 'traumatic', 'abuse'],
    'self-esteem': ['self-esteem', 'confidence', 'self-worth', 'insecure', 'doubt'],
    'work': ['work', 'job', 'career', 'workplace', 'boss', 'colleague', 'burnout'],
    'family': ['family', 'parent', 'child', 'sibling', 'mother', 'father'],
    'meditation': ['meditation', 'meditate', 'mindfulness', 'breathing', 'calm'],
    'yoga': ['yoga', 'stretch', 'posture', 'asana'],
    'health': ['health', 'wellness', 'exercise', 'fitness', 'body'],
    'music': ['music', 'song', 'songs', 'sound', 'sounds', 'listen', 'listening', 'audio']
  }

  // Check for matching topics
  for (const [topic, patterns] of Object.entries(topicPatterns)) {
    if (patterns.some(pattern => text.includes(pattern))) {
      topics.push(topic)
    }
  }

  return topics
}

/**
 * Get search query based on user context
 */
export const getContextualSearchQuery = (): string | null => {
  const context = getUserContext()
  
  // If no recent conversations, return null
  if (context.lastConversation.length === 0) {
    return null
  }

  // Build query from topics
  if (context.topics.length > 0) {
    const topicsQuery = context.topics.slice(0, 3).join(' ')
    return `${topicsQuery} meditation music mindfulness guided practice wellness songs relaxation`
  }

  // Fallback to last conversation
  const lastConvo = context.lastConversation[context.lastConversation.length - 1]
  if (lastConvo) {
    // Extract key terms from question
    const words = lastConvo.question
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 4)
      .join(' ')
    
    return `${words} meditation music guided practice wellness songs relaxation`
  }

  return null
}
