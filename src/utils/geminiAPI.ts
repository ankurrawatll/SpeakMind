// Gemini AI API integration utility
// This file handles all interactions with Google's Gemini AI API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Multiple endpoints to try in case one doesn't work - prefer v1 Gemini 2.5 models
const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent',
  // fallbacks to 2.0 family
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'
]

export interface GeminiResponse {
  success: boolean
  text?: string
  error?: string
}

/**
 * Call Gemini AI API with a wellness-focused prompt
 * @param question - User's question about mental wellness/meditation
 * @returns Promise<GeminiResponse>
 */
export const callGeminiAPI = async (question: string): Promise<GeminiResponse> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return {
      success: false,
      error: 'Gemini API key not configured. Please add your real API key to the .env.local file. Get your key from: https://makersuite.google.com/app/apikey'
    }
  }

  const requestBody = {
    contents: [{
      parts: [{
        text: `You are a compassionate mental wellness coach and meditation expert named "Mindful Guide". Please provide helpful, supportive guidance for this question about mindfulness, meditation, or mental health: "${question}". 

Keep your response warm, encouraging, practical, and limited to 2-3 paragraphs. Focus on mindfulness and wellness techniques.`
      }]
    }]
  }

  // Try each endpoint until one works
  for (let i = 0; i < GEMINI_ENDPOINTS.length; i++) {
    const endpoint = GEMINI_ENDPOINTS[i]
    
    try {
      const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return {
            success: true,
            text: data.candidates[0].content.parts[0].text
          }
        }
      } else {
        // If this is the last endpoint, throw the error
        if (i === GEMINI_ENDPOINTS.length - 1) {
          let errorMessage = `HTTP error! status: ${response.status}`
          
          if (response.status === 400) {
            errorMessage = 'Invalid API request. Please check if your Gemini API key is valid.'
          } else if (response.status === 401) {
            errorMessage = 'Unauthorized. Please check if your Gemini API key is correct.'
          } else if (response.status === 403) {
            errorMessage = 'Access forbidden. Your API key may not have permission to use Gemini models.'
          } else if (response.status === 404) {
            errorMessage = 'API endpoint not found. Please check if your API key has access to Gemini models.'
          } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.'
          }
          
          throw new Error(errorMessage)
        }
      }
    } catch (error) {
      // If this is the last endpoint, return the error
      if (i === GEMINI_ENDPOINTS.length - 1) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get AI response. Please try again.'
        }
      }
    }
  }

  return {
    success: false,
    error: 'All API endpoints failed. Please try again later.'
  }
}

/**
 * Get predefined wellness responses for common scenarios
 */
export const getWellnessTips = () => {
  const tips = [
    "Take three deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system and promotes calm.",
    "Try the 5-4-3-2-1 grounding technique: Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    "Remember that mindfulness is about observing your thoughts without judgment. You don't need to stop thinking - just notice when your mind wanders and gently bring attention back to the present.",
    "Start small with meditation. Even 2-3 minutes daily is more beneficial than longer sessions done inconsistently.",
    "Your mental wellness journey is unique to you. Be patient and compassionate with yourself as you develop these practices."
  ]
  
  return tips[Math.floor(Math.random() * tips.length)]
}