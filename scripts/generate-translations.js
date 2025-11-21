/**
 * Translation Generator Script
 * Generates translations for all supported languages using Gemini API
 * Includes rate limiting to avoid 403 errors
 * 
 * Usage: npm run generate-translations
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPPORTED_LANGUAGES = {
  hi: { name: 'Hindi', nativeName: 'हिंदी' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
}

// Rate limiting: delay between API calls (in milliseconds)
const RATE_LIMIT_DELAY = 3000 // 3 seconds between calls
const BATCH_DELAY = 6000 // 6 seconds between language batches

// Call Gemini API directly
async function callGeminiAPI(prompt) {
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
        console.log('⚠️  Rate limited. Waiting 15 seconds...')
        await new Promise(resolve => setTimeout(resolve, 15000))
        continue
      }
      
      if (i === GEMINI_ENDPOINTS.length - 1) {
        const errorText = await response.text().catch(() => 'Unknown error')
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

// Load English translations as source
function loadEnglishTranslations() {
  const enPath = path.join(__dirname, '../src/locales/en.json')
  return JSON.parse(fs.readFileSync(enPath, 'utf-8'))
}

// Generate translation for a single language
async function generateTranslation(langCode, langInfo, englishTranslations) {
  console.log(`\n🌐 Generating translations for ${langInfo.name} (${langInfo.nativeName})...`)

  const prompt = `Translate the following JSON object from English to ${langInfo.name} (${langInfo.nativeName}).
  
IMPORTANT RULES:
1. Keep the exact same JSON structure and keys
2. Only translate the VALUES, not the keys
3. Preserve placeholders like {{variableName}} exactly as they are
4. Maintain the same formatting and structure
5. Return ONLY valid JSON, no explanations or markdown code blocks
6. Use natural, conversational translations appropriate for a meditation/wellness app
7. Keep technical terms like "EEG", "AI", "Meditation" in English if commonly used in ${langInfo.name}
8. Ensure translations are culturally appropriate for Indian users

English JSON:
${JSON.stringify(englishTranslations, null, 2)}

Return the translated JSON (ONLY the JSON, no markdown, no explanations):`

  try {
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY))

    const response = await callGeminiAPI(prompt)
    
    if (!response.success || !response.text) {
      throw new Error(response.error || 'Failed to get translation from Gemini')
    }

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = response.text.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/gm, '').replace(/```$/gm, '').trim()
    }

    // Try to find JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }

    // Parse the JSON
    const translated = JSON.parse(jsonText)

    // Validate structure matches
    if (typeof translated !== 'object') {
      throw new Error('Invalid JSON structure returned')
    }

    // Save to file
    const outputPath = path.join(__dirname, `../src/locales/${langCode}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf-8')
    
    console.log(`✅ Successfully generated ${langInfo.name} translations`)
    return true
  } catch (error) {
    console.error(`❌ Error generating ${langInfo.name} translations:`, error.message)
    
    // Create file with English fallback structure
    const outputPath = path.join(__dirname, `../src/locales/${langCode}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(englishTranslations, null, 2), 'utf-8')
    console.log(`⚠️  Created fallback file with English translations`)
    
    return false
  }
}

// Main function
async function main() {
  console.log('🚀 Starting translation generation...\n')
  console.log('⚠️  This will make API calls to Gemini. Rate limiting is enabled.\n')

  // Check if Gemini API key is configured
  const geminiKey = process.env.VITE_GEMINI_API_KEY
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here' || geminiKey === 'your-gemini-api-key') {
    console.error('❌ VITE_GEMINI_API_KEY not configured in .env file')
    console.error('Please add your Gemini API key to .env file')
    process.exit(1)
  }

  // Load English translations
  const englishTranslations = loadEnglishTranslations()
  console.log(`📖 Loaded English translations (${Object.keys(englishTranslations).length} top-level keys)\n`)

  // Ensure locales directory exists
  const localesDir = path.join(__dirname, '../src/locales')
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true })
  }

  // Generate translations for each language
  const results = []
  const languageEntries = Object.entries(SUPPORTED_LANGUAGES)
  
  for (let i = 0; i < languageEntries.length; i++) {
    const [langCode, langInfo] = languageEntries[i]
    const success = await generateTranslation(langCode, langInfo, englishTranslations)
    results.push({ langCode, success })
    
    // Add delay between languages to avoid rate limits (except for last one)
    if (i < languageEntries.length - 1) {
      console.log(`⏳ Waiting ${BATCH_DELAY / 1000} seconds before next language...`)
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Translation Generation Summary')
  console.log('='.repeat(50))
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📁 Total languages: ${results.length}`)
  
  if (failed > 0) {
    console.log('\n⚠️  Some translations failed. Check the error messages above.')
    console.log('Failed languages will have English fallback translations.')
  } else {
    console.log('\n🎉 All translations generated successfully!')
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
