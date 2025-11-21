import { useEffect, useRef, useState, useCallback } from 'react'
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai'
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils'

const INPUT_SAMPLE_RATE = 16000
const OUTPUT_SAMPLE_RATE = 24000

export type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface UseGeminiLiveOptions {
  onMessage?: (text: string, isUser: boolean) => void
  onError?: (error: string) => void
}

export const useGeminiLive = (options?: UseGeminiLiveOptions) => {
  const [status, setStatus] = useState<LiveStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [volume, setVolume] = useState<number>(0)

  // Audio Contexts and Nodes
  const inputAudioContextRef = useRef<AudioContext | null>(null)
  const outputAudioContextRef = useRef<AudioContext | null>(null)
  const inputAnalyserRef = useRef<AnalyserNode | null>(null)
  const outputAnalyserRef = useRef<AnalyserNode | null>(null)
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Session State
  const sessionPromiseRef = useRef<Promise<any> | null>(null)
  const nextStartTimeRef = useRef<number>(0)
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set())

  // Animation Frame for Visualizer
  const animationFrameRef = useRef<number | null>(null)

  const updateVolume = () => {
    if (inputAnalyserRef.current && outputAnalyserRef.current) {
      const inputBuffer = new Uint8Array(inputAnalyserRef.current.frequencyBinCount)
      const outputBuffer = new Uint8Array(outputAnalyserRef.current.frequencyBinCount)

      inputAnalyserRef.current.getByteFrequencyData(inputBuffer)
      outputAnalyserRef.current.getByteFrequencyData(outputBuffer)

      let inputSum = 0
      let outputSum = 0

      for (let i = 0; i < inputBuffer.length; i++) inputSum += inputBuffer[i]
      for (let i = 0; i < outputBuffer.length; i++) outputSum += outputBuffer[i]

      const inputAvg = inputSum / inputBuffer.length
      const outputAvg = outputSum / outputBuffer.length

      // Normalize to 0-1, prioritizing the louder source for visualization
      const maxVol = Math.max(inputAvg, outputAvg) / 255
      setVolume(maxVol)
    }
    animationFrameRef.current = requestAnimationFrame(updateVolume)
  }

  const connect = useCallback(async () => {
    try {
      setStatus('connecting')
      setError(null)

      // 1. Initialize Audio Contexts
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      inputAudioContextRef.current = new AudioContext({
        sampleRate: INPUT_SAMPLE_RATE
      })
      outputAudioContextRef.current = new AudioContext({
        sampleRate: OUTPUT_SAMPLE_RATE
      })

      // 2. Setup Analysers
      inputAnalyserRef.current = inputAudioContextRef.current.createAnalyser()
      inputAnalyserRef.current.fftSize = 256

      outputAnalyserRef.current = outputAudioContextRef.current.createAnalyser()
      outputAnalyserRef.current.fftSize = 256

      // 3. Get User Media
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 4. Initialize Gemini Client
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      const ai = new GoogleGenAI({ apiKey })

      // 5. Connect to Live API
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened')
            setStatus('connected')

            // Setup Input Pipeline
            if (!inputAudioContextRef.current || !streamRef.current || !inputAnalyserRef.current) return

            inputSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current)
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1)

            inputSourceRef.current.connect(inputAnalyserRef.current)
            inputAnalyserRef.current.connect(scriptProcessorRef.current)
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination)

            scriptProcessorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0)
              const pcmBlob = createBlob(inputData)

              sessionPromiseRef.current?.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob })
              })
            }

            // Start Visualizer Loop
            updateVolume()
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data
            if (base64Audio && outputAudioContextRef.current && outputAnalyserRef.current) {
              const ctx = outputAudioContextRef.current
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime)

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                OUTPUT_SAMPLE_RATE,
                1
              )

              const source = ctx.createBufferSource()
              source.buffer = audioBuffer

              // Route through analyser to destination
              source.connect(outputAnalyserRef.current)
              outputAnalyserRef.current.connect(ctx.destination)

              source.addEventListener('ended', () => {
                activeSourcesRef.current.delete(source)
              })

              source.start(nextStartTimeRef.current)
              nextStartTimeRef.current += audioBuffer.duration
              activeSourcesRef.current.add(source)
            }

            const interrupted = message.serverContent?.interrupted
            if (interrupted) {
              activeSourcesRef.current.forEach(src => src.stop())
              activeSourcesRef.current.clear()
              nextStartTimeRef.current = 0
            }
          },
          onclose: () => {
            console.log('Gemini Live Session Closed')
            setStatus('disconnected')
          },
          onerror: (e) => {
            console.error('Gemini Live Session Error', e)
            setStatus('error')
            setError('Connection error. Please try again.')
            disconnect()
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: `You are a compassionate mental wellness coach and meditation expert named "Mindful Guide".
Your purpose is to help the user relax, ground themselves, and find mindfulness.
Speak slowly, softly, and with intention. Use pauses effectively to create a relaxed pace.
Start by warmly welcoming the user and asking how they are feeling today.
Based on their response, offer a short, guided breathing exercise or a visualization.
Keep your responses relatively brief but warm, encouraging a conversational flow rather than a monologue.
If the user is stressed, acknowledge it with validation and suggest a grounding technique.
Always maintain a soothing tone.`
        }
      })
    } catch (err: any) {
      console.error('Failed to connect:', err)
      setStatus('error')
      setError(err.message || 'Failed to initialize session')
      disconnect()
    }
  }, [])

  const disconnect = useCallback(() => {
    // Stop Animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Close Live Session
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
        if (typeof session.close === 'function') {
          session.close()
        }
      }).catch(() => {})
      sessionPromiseRef.current = null
    }

    // Stop Media Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Cleanup Input Audio
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect()
      scriptProcessorRef.current.onaudioprocess = null
      scriptProcessorRef.current = null
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect()
      inputSourceRef.current = null
    }
    if (inputAnalyserRef.current) {
      inputAnalyserRef.current.disconnect()
      inputAnalyserRef.current = null
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close()
      inputAudioContextRef.current = null
    }

    // Cleanup Output Audio
    activeSourcesRef.current.forEach(src => src.stop())
    activeSourcesRef.current.clear()

    if (outputAnalyserRef.current) {
      outputAnalyserRef.current.disconnect()
      outputAnalyserRef.current = null
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close()
      outputAudioContextRef.current = null
    }

    nextStartTimeRef.current = 0
    setVolume(0)
    if (status !== 'error') setStatus('disconnected')
  }, [status])

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { connect, disconnect, status, error, volume }
}
