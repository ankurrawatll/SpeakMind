/**
 * API Configuration
 * 
 * USE_SERVERLESS controls whether API keys are protected via serverless functions
 * 
 * - true: API calls go through /api/gemini and /api/youtube (API keys hidden)
 *         Recommended for production deployments
 * 
 * - false: API calls use client-side keys from .env (API keys exposed in browser)
 *          Only use for local development/testing
 */

// Automatically detect environment
const isProduction = import.meta.env.PROD
const isVercel = import.meta.env.VITE_VERCEL === '1'

export const USE_SERVERLESS = isProduction || isVercel

// Log configuration on load (development only)
if (import.meta.env.DEV) {
  console.log('[API Config] Environment:', import.meta.env.MODE)
  console.log('[API Config] Using serverless:', USE_SERVERLESS)
}
