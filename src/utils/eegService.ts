// EEG Service - Handles EEG device connection and data recording
// Works on localhost only (direct device connection)

export interface EEGDataPoint {
  alpha: number
  beta: number
  theta: number
  delta: number
  gamma: number
  timestamp: number
}

export interface EEGSession {
  id: string
  startTime: number
  endTime: number | null
  duration: number // in seconds
  dataPoints: EEGDataPoint[]
  isActive: boolean
}

export class EEGService {
  private static instance: EEGService
  private currentSession: EEGSession | null = null
  private dataCallback: ((data: EEGDataPoint) => void) | null = null
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected'
  private mockMode: boolean = false

  private constructor() {
    // Check if running on localhost
    this.mockMode = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  }

  static getInstance(): EEGService {
    if (!EEGService.instance) {
      EEGService.instance = new EEGService()
    }
    return EEGService.instance
  }

  /**
   * Check if EEG connection is available (localhost only)
   */
  isAvailable(): boolean {
    return !this.mockMode
  }

  /**
   * Connect to EEG device
   * Supports WebSocket, Web Bluetooth, or REST API
   */
  async connect(connectionType: 'websocket' | 'bluetooth' | 'api' = 'websocket'): Promise<boolean> {
    if (this.mockMode) {
      console.warn('EEG connection only available on localhost')
      return false
    }

    this.connectionStatus = 'connecting'

    try {
      switch (connectionType) {
        case 'websocket':
          return await this.connectWebSocket()
        case 'bluetooth':
          return await this.connectBluetooth()
        case 'api':
          return await this.connectAPI()
        default:
          return false
      }
    } catch (error) {
      console.error('EEG connection failed:', error)
      this.connectionStatus = 'disconnected'
      return false
    }
  }

  /**
   * Connect via WebSocket (for IoT/network EEG devices)
   */
  private async connectWebSocket(): Promise<boolean> {
    // Example WebSocket connection
    // Replace with your actual EEG device WebSocket URL
    const wsUrl = 'ws://localhost:8080/eeg' // Update with your device URL
    
    try {
      const ws = new WebSocket(wsUrl)
      
      return new Promise((resolve) => {
        ws.onopen = () => {
          this.connectionStatus = 'connected'
          console.log('EEG WebSocket connected')
          
          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              const eegPoint: EEGDataPoint = {
                alpha: data.alpha || 0,
                beta: data.beta || 0,
                theta: data.theta || 0,
                delta: data.delta || 0,
                gamma: data.gamma || 0,
                timestamp: Date.now()
              }
              
              if (this.dataCallback) {
                this.dataCallback(eegPoint)
              }
              
              if (this.currentSession && this.currentSession.isActive) {
                this.currentSession.dataPoints.push(eegPoint)
              }
            } catch (error) {
              console.error('Error parsing EEG data:', error)
            }
          }
          
          resolve(true)
        }
        
        ws.onerror = () => {
          this.connectionStatus = 'disconnected'
          resolve(false)
        }
        
        ws.onclose = () => {
          this.connectionStatus = 'disconnected'
        }
      })
    } catch (error) {
      this.connectionStatus = 'disconnected'
      return false
    }
  }

  /**
   * Connect via Web Bluetooth (for BLE EEG devices)
   */
  private async connectBluetooth(): Promise<boolean> {
    try {
      if (!navigator.bluetooth) {
        console.error('Web Bluetooth API not available')
        return false
      }

      // Replace with your EEG device's service UUID
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['0000eeg0-0000-1000-8000-00805f9b34fb'] }] // Update with actual UUID
      })

      const server = await device.gatt?.connect()
      if (!server) return false

      const service = await server.getPrimaryService('0000eeg0-0000-1000-8000-00805f9b34fb')
      const characteristic = await service.getCharacteristic('0000eeg1-0000-1000-8000-00805f9b34fb')

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value
        // Parse EEG data from characteristic value
        // Format depends on your device
        const eegPoint: EEGDataPoint = this.parseBluetoothData(value)
        
        if (this.dataCallback) {
          this.dataCallback(eegPoint)
        }
        
        if (this.currentSession && this.currentSession.isActive) {
          this.currentSession.dataPoints.push(eegPoint)
        }
      })

      await characteristic.startNotifications()
      this.connectionStatus = 'connected'
      return true
    } catch (error) {
      console.error('Bluetooth connection failed:', error)
      this.connectionStatus = 'disconnected'
      return false
    }
  }

  /**
   * Connect via REST API (for cloud-based EEG services)
   */
  private async connectAPI(): Promise<boolean> {
    // Example: Polling API endpoint
    // Replace with your actual API endpoint
    const apiUrl = 'http://localhost:3000/api/eeg/stream'
    
    try {
      // Start polling for EEG data
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(apiUrl)
          const data = await response.json()
          
          const eegPoint: EEGDataPoint = {
            alpha: data.alpha || 0,
            beta: data.beta || 0,
            theta: data.theta || 0,
            delta: data.delta || 0,
            gamma: data.gamma || 0,
            timestamp: Date.now()
          }
          
          if (this.dataCallback) {
            this.dataCallback(eegPoint)
          }
          
          if (this.currentSession && this.currentSession.isActive) {
            this.currentSession.dataPoints.push(eegPoint)
          }
        } catch (error) {
          console.error('Error fetching EEG data:', error)
        }
      }, 100) // Poll every 100ms
      
      // Store interval ID for cleanup
      ;(this as any).pollInterval = pollInterval
      
      this.connectionStatus = 'connected'
      return true
    } catch (error) {
      console.error('API connection failed:', error)
      this.connectionStatus = 'disconnected'
      return false
    }
  }

  /**
   * Parse Bluetooth characteristic value to EEG data
   * Update this based on your device's data format
   */
  private parseBluetoothData(value: DataView): EEGDataPoint {
    // Example parsing - adjust based on your device format
    return {
      alpha: value.getFloat32(0, true),
      beta: value.getFloat32(4, true),
      theta: value.getFloat32(8, true),
      delta: value.getFloat32(12, true),
      gamma: value.getFloat32(16, true),
      timestamp: Date.now()
    }
  }

  /**
   * Start a new EEG recording session
   */
  startSession(): EEGSession {
    const session: EEGSession = {
      id: `session-${Date.now()}`,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      dataPoints: [],
      isActive: true
    }
    
    this.currentSession = session
    return session
  }

  /**
   * Stop the current session
   */
  stopSession(): EEGSession | null {
    if (!this.currentSession) return null
    
    this.currentSession.endTime = Date.now()
    this.currentSession.duration = Math.floor(
      (this.currentSession.endTime - this.currentSession.startTime) / 1000
    )
    this.currentSession.isActive = false
    
    return this.currentSession
  }

  /**
   * Get current session
   */
  getCurrentSession(): EEGSession | null {
    return this.currentSession
  }

  /**
   * Set callback for real-time data updates
   */
  onDataUpdate(callback: (data: EEGDataPoint) => void) {
    this.dataCallback = callback
  }

  /**
   * Remove data callback
   */
  removeDataCallback() {
    this.dataCallback = null
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'disconnected' | 'connecting' | 'connected' {
    return this.connectionStatus
  }

  /**
   * Disconnect from EEG device
   */
  disconnect() {
    this.connectionStatus = 'disconnected'
    this.removeDataCallback()
    
    // Clean up polling if using API
    if ((this as any).pollInterval) {
      clearInterval((this as any).pollInterval)
    }
  }

  /**
   * Generate mock data for testing (when not on localhost)
   */
  generateMockData(): EEGDataPoint {
    const t = Date.now() / 1000
    return {
      alpha: 15 + 8 * Math.sin(t * 0.1) + (Math.random() - 0.5) * 4,
      beta: 18 + 6 * Math.sin(t * 0.2) + (Math.random() - 0.5) * 6,
      theta: 8 + 5 * Math.sin(t * 0.06) + (Math.random() - 0.5) * 3,
      delta: 3 + 2 * Math.sin(t * 0.02) + (Math.random() - 0.5) * 2,
      gamma: 35 + 3 * Math.sin(t * 0.4) + (Math.random() - 0.5) * 4,
      timestamp: Date.now()
    }
  }
}

