/**
 * Translation utility functions for the translation generator script
 */

export async function callGeminiAPIDirect(prompt) {
  const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here' || GEMINI_API_KEY === 'your-gemini-api-key') {
    return {
      success: false,
      error: 'Gemini API key not configured'
    }
  }

  const GEMINI_ENDPOINTS = [
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  ]

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  }

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
      }
      
      // If we get rate limited, wait and retry
      if (response.status === 429) {
        console.log('⚠️  Rate limited. Waiting 10 seconds...')
        await new Promise(resolve => setTimeout(resolve, 10000))
        continue
      }
      
      if (i === GEMINI_ENDPOINTS.length - 1) {
        const errorText = await response.text()
        return {
          success: false,
          error: `API request failed: ${response.status} - ${errorText}`
        }
      }
    } catch (error) {
      if (i === GEMINI_ENDPOINTS.length - 1) {
        return {
          success: false,
          error: error.message
        }
      }
    }
  }

  return {
    success: false,
    error: 'All API endpoints failed'
  }
}

