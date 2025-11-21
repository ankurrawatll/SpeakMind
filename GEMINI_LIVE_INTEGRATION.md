# Gemini Live Integration

This document describes the Gemini Live voice chat integration in the SpeakMind app.

## Overview

The Gemini Live integration enables real-time voice conversations with an AI wellness coach through a dedicated immersive voice session screen.

## Files Created/Modified

### New Files
- `src/hooks/useGeminiLive.ts` - Main hook for Gemini Live API integration
- `src/utils/audioUtils.ts` - Audio encoding/decoding utilities
- `src/screens/VoiceSessionScreen.tsx` - Dedicated voice session screen with visualizer
- `src/components/Visualizer.tsx` - Audio visualizer component
- `src/components/AmbientBackground.tsx` - Ambient background component

### Modified Files
- `src/screens/ConversationScreen.tsx` - Added button to launch voice session, uses text-based API
- `src/App.tsx` - Added voice session screen route
- `package.json` - Added `@google/genai` dependency

## Features

1. **Immersive Voice Session Screen**: Full-screen experience with audio visualizer
2. **Real-time Voice Chat**: Continuous bidirectional audio streaming with Gemini AI
3. **Visual Feedback**: 
   - Animated audio visualizer that responds to volume
   - Connection status messages
   - Pulsing rings that scale with audio input/output
4. **Ambient Background**: Beautiful gradient background with animated blobs
5. **Controls**:
   - Play/Stop button for starting/ending session
   - Mute button (visual only)
   - Back button to return to conversation

## How to Use

1. Navigate to the Conversation screen (click on any mood from home)
2. Click the voice session icon in the top-right header
3. On the voice session screen, click the play button to start
4. Once connected, start speaking naturally
5. The AI will respond with voice in real-time
6. Watch the visualizer respond to audio activity
7. Click the stop button or back button to end the session

## Technical Details

### Audio Processing
- Input: 16kHz PCM audio from microphone
- Output: 24kHz audio from Gemini
- Uses Web Audio API for real-time processing
- ScriptProcessorNode for capturing microphone input
- AudioContext for playback with proper timing

### API Configuration
- Model: `gemini-2.5-flash-native-audio-preview-09-2025`
- Voice: Puck (gentle, androgynous)
- Response modality: Audio only
- System instruction: Configured as compassionate wellness coach

### Environment Variables
Requires `VITE_GEMINI_API_KEY` in `.env.local`

## Implementation Reference

Based on the official Gemini Live implementation in the `Gemini live implementation` folder, using:
- `@google/genai` SDK for WebSocket connection
- Audio utilities for PCM encoding/decoding
- Real-time audio streaming with proper buffer management
