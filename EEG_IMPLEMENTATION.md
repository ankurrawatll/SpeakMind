# EEG Meditation Session Implementation Guide

## Overview
This implementation adds an EEG meditation session feature to the Brain Health tab. Users can connect their EEG device, start a guided meditation session with music, see real-time brain wave visualizations, and receive AI-powered analysis after completion.

## Architecture

### Components Created

1. **`src/utils/eegService.ts`** - Core EEG service
   - Handles device connection (WebSocket, Bluetooth, or REST API)
   - Manages EEG data recording during sessions
   - Provides session management
   - Works only on localhost (direct device connection)

2. **`src/components/EEGVisualizer.tsx`** - Real-time visualization
   - Displays live brain wave patterns (Alpha, Beta, Theta, Delta, Gamma)
   - Updates in real-time during meditation session
   - Shows wave frequencies and amplitudes

3. **`src/components/EEGMeditationSession.tsx`** - Main session component
   - Handles full meditation flow
   - Connects to EEG device
   - Plays meditation music (OM chanting/melody)
   - Shows timer and real-time visualizations
   - Generates AI analysis after completion

4. **`src/components/EEGAnalysisReport.tsx`** - Post-session report
   - Displays AI-generated insights
   - Shows session summary and metrics
   - Provides personalized recommendations

5. **`src/screens/EEGBrainHealthScreen.tsx`** - Updated main screen
   - Main entry point for EEG feature
   - Session duration selector
   - Navigation to session and report views

## User Flow

1. **Main Screen** → User selects duration (5, 10, 15, 20, or 30 minutes)
2. **Start Session** → User clicks "Start EEG Meditation Session"
3. **Connection** → App attempts to connect to EEG device (localhost only)
4. **Instructions** → User sees setup instructions
5. **Active Session** → 
   - Meditation music plays automatically
   - Real-time EEG visualizations display
   - Timer counts down
6. **Completion** → Session ends, data is recorded
7. **AI Analysis** → Gemini AI analyzes EEG data and generates insights
8. **Report** → User views personalized analysis report

## Technical Details

### EEG Device Connection

The service supports three connection methods:

1. **WebSocket** (default)
   - For IoT/network EEG devices
   - Update `wsUrl` in `connectWebSocket()` method
   - Expected data format: `{ alpha, beta, theta, delta, gamma }`

2. **Web Bluetooth**
   - For BLE EEG devices
   - Update service/characteristic UUIDs in `connectBluetooth()`
   - Implement `parseBluetoothData()` for your device format

3. **REST API**
   - For cloud-based EEG services
   - Update `apiUrl` in `connectAPI()`
   - Polls endpoint every 100ms

### Data Format

EEG data points follow this structure:
```typescript
interface EEGDataPoint {
  alpha: number    // 8-13 Hz (relaxed awareness)
  beta: number     // 13-30 Hz (active concentration)
  theta: number    // 4-8 Hz (deep relaxation)
  delta: number    // 0.5-4 Hz (deep sleep)
  gamma: number    // 30-100 Hz (high-level processing)
  timestamp: number
}
```

### AI Analysis

After session completion, the app:
1. Calculates average brain wave values
2. Computes metrics (focus, stress, relaxation, sleep quality)
3. Sends data to Gemini AI with a detailed prompt
4. Receives personalized wellness insights
5. Displays analysis in user-friendly format

### Music Integration

- Meditation music plays automatically when session starts
- Currently uses placeholder URL - replace with actual OM chanting/melody
- Audio loops during entire session
- Stops automatically when session completes

## Configuration

### Update EEG Device Connection

Edit `src/utils/eegService.ts`:

```typescript
// For WebSocket
const wsUrl = 'ws://YOUR_DEVICE_IP:PORT/eeg'

// For Bluetooth
filters: [{ services: ['YOUR_SERVICE_UUID'] }]

// For REST API
const apiUrl = 'http://YOUR_API_URL/api/eeg/stream'
```

### Update Meditation Music

Edit `src/components/EEGMeditationSession.tsx`:

```typescript
const audioUrl = 'YOUR_OM_CHANTING_OR_MELODY_URL'
```

### Localhost Detection

The app automatically detects if running on localhost:
- `localhost` or `127.0.0.1` → EEG features enabled
- Other domains → Shows warning message

## Features

✅ **Real-time EEG Visualization** - Live brain wave patterns during session
✅ **Meditation Music** - Automatic OM chanting/melody playback
✅ **AI-Powered Analysis** - Personalized insights from Gemini AI
✅ **Session Recording** - All EEG data stored during session
✅ **Localhost Only** - Direct device connection (no ESP32 needed)
✅ **User-Friendly UI** - Clean, intuitive interface matching app design
✅ **No Raw Data Display** - Only shows AI analysis, not raw EEG numbers

## Limitations

- **Localhost Only**: EEG connection only works when app runs on localhost
- **Device Dependent**: Requires compatible EEG device with WebSocket/Bluetooth/API support
- **No ESP32**: Direct connection to laptop/computer, not mobile device
- **Music URL**: Currently uses placeholder - needs actual meditation audio file

## Testing

1. Run app on localhost: `npm run dev`
2. Navigate to Brain Health tab
3. Select session duration
4. Click "Start EEG Meditation Session"
5. Connect your EEG device
6. Complete meditation session
7. View AI analysis report

## Future Enhancements

- Historical session tracking
- Progress trends over time
- Multiple meditation music options
- Session sharing capabilities
- Export analysis reports
- Integration with other app features (mood tracking, journaling)

## Notes

- All EEG data is processed locally during session
- AI analysis is generated after session completion
- No raw EEG data is displayed to user (only insights)
- Session data is stored in memory (not persisted to database)
- Real-time visualization only works during active session

