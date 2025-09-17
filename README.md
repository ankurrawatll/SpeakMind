# SpeakMind - Mobile Meditation & Mindfulness App

A comprehensive mobile-first meditation and mindfulness application built with React, TypeScript, Vite, and Tailwind CSS. SpeakMind connects users with AI-powered meditation coaching, community features, and personalized mindfulness journeys.

## 🌟 Features

### 🪷 **Onboarding & Authentication**
- Beautiful gradient splash screen with lotus branding
- Quick sign-in with Gmail or email/phone options
- "Meditate With Us!" tagline and welcoming design

### 🏠 **Home Dashboard**
- Personalized greeting with mood selector
- Quick access to ask questions feature
- AI Coach recommended sessions with thumbnails
- Streak tracking and motivation

### � **Ask Questions**
- Expandable FAQ section with common meditation questions
- Free-form question input with text or voice
- Direct connection to AI conversation interface

### 🔥 **Streaks & Calendar**
- Visual calendar showing meditation history
- Current streak display and stats
- "Miracle Moment" daily motivation
- Progress tracking and insights

### 🧘‍♀️ **Meditation Timer**
- Customizable duration (5-60 minutes)
- Beautiful circular progress indicator
- Breathing guidance animations
- Session completion celebration

### 🤖 **AI Coach**
- Guided meditation sessions with media player
- Play/pause controls and progress tracking
- Session descriptions and categories
- Immersive audio experience UI

### 👤 **Profile & Analytics**
- User stats: streak, time meditated, sessions, points
- Weekly meditation insights with bar chart
- Achievement system with unlock progress
- Level progression tracking

### 👥 **Community Sharing**
- Friends list with online status
- Activity sharing and updates
- Direct messaging integration
- Social motivation features

### 🎯 **Mind Coach Video Calls**
- Video call interface with coach
- Live consultation features
- Call controls (mic, video, end call)
- Professional coaching experience

### 💬 **AI Conversation**
- Chat interface with meditation AI
- Real-time responses and guidance
- Voice input support
- Contextual help and advice

## 🎨 Design System

### **Color Palette**
- **Primary Purple**: `#9D7CF3` - Main brand color
- **Primary Pink**: `#FFB8C4` - Accent and gradients
- **Primary Yellow**: `#FDC75E` - Highlights and achievements
- **Primary Orange**: `#FF9A76` - Energy and motivation

### **Mobile-First Approach**
- Maximum width container (max-w-md)
- Touch-optimized interactions
- Gesture-friendly button sizes
- Smooth animations and transitions

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.4
- **Icons**: Emoji-based design system
- **State Management**: React useState (local state)
- **Responsive**: Mobile-first design approach

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google providers
   - Copy `.env.example` to `.env` and fill in your Firebase config values
   - Get your config from Project Settings > General > Your apps

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:5174`
   - Best viewed in mobile viewport (375px width)

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🔐 Firebase Authentication Setup

### **Required Firebase Services:**
- **Authentication**: Email/Password and Google Sign-In
- **Firestore Database**: User data and meditation progress (optional)

### **Environment Variables:**
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### **Firebase Console Setup:**
1. Go to Authentication > Sign-in method
2. Enable Email/Password provider
3. Enable Google provider (add your domain)
4. Add authorized domains for production

## 📱 App Flow & Navigation

### **Screen Flow:**
1. **Onboarding** → Authentication options
2. **Home** → Main dashboard with mood & quick actions
3. **Ask Question** → FAQ + AI question interface
4. **Streaks** → Calendar view and progress
5. **Timer** → Meditation session interface
6. **AI Coach** → Media player for guided sessions
7. **Profile** → User stats and achievements
8. **Sharing** → Community and friends
9. **Mind Coach** → Video call interface
10. **Conversation** → AI chat for guidance

### **Bottom Navigation:**
- 🏠 Home
- 🧘‍♀️ Meditation
- 🎯 Mind Coach
- 👥 Sharing
- 👤 Profile

## 📂 Project Structure

```
src/
├── components/
│   └── BottomNavigation.tsx    # Main navigation component
├── screens/
│   ├── OnboardingScreen.tsx    # Login/splash screen
│   ├── HomeScreen.tsx          # Main dashboard
│   ├── AskQuestionScreen.tsx   # FAQ + question input
│   ├── StreaksScreen.tsx       # Calendar & progress
│   ├── MeditationTimerScreen.tsx # Timer interface
│   ├── AICoachScreen.tsx       # Media player
│   ├── ProfileScreen.tsx       # User profile & stats
│   ├── SharingScreen.tsx       # Community features
│   ├── MindCoachScreen.tsx     # Video call UI
│   └── ConversationScreen.tsx  # AI chat interface
├── hooks/                      # Custom React hooks
├── App.tsx                     # Main app component
├── main.tsx                    # Entry point
└── index.css                   # Global styles + Tailwind
```

## 🎯 Key Features Implementation

### **Mobile Optimizations:**
- Touch target sizes (44px minimum)
- Swipe gestures and transitions
- Haptic feedback ready
- iOS/Android safe areas
- Prevent zoom on input focus

### **Responsive Components:**
- `mobile-container` - Main app wrapper
- `card` - Consistent content containers
- `btn-primary/secondary` - Touch-optimized buttons
- `gradient-bg` - Brand gradient backgrounds

### **State Management:**
- Authentication state persistence
- User progress tracking
- Screen navigation state
- Timer and session state

## 🔮 Future Enhancements

### **Backend Integration:**
- User authentication & profiles
- Meditation session storage
- Social features & friend connections
- AI conversation history
- Progress analytics

### **Advanced Features:**
- Push notifications for reminders
- Offline meditation downloads
- Wearable device integration
- Advanced progress analytics
- Social sharing capabilities
- Premium subscription features

### **Technical Improvements:**
- PWA (Progressive Web App) capabilities
- Native app conversion (React Native)
- Advanced animations (Framer Motion)
- Voice recognition integration
- Background audio support

## 📋 Development Notes

- **Mobile-first**: Designed exclusively for mobile viewports
- **Touch-optimized**: All interactions work well on touch devices
- **Performance**: Optimized for mobile performance
- **Accessibility**: Emoji-based icons for universal understanding
- **Theming**: Consistent design system with Tailwind classes

## 🧘‍♀️ App Philosophy

**SpeakMind** is designed to make meditation and mindfulness accessible, engaging, and social. The app combines:

- **AI-powered guidance** for personalized experiences
- **Community features** for motivation and support  
- **Progress tracking** for long-term habit building
- **Beautiful design** that encourages daily use

---

**SpeakMind** - *Your pocket meditation companion for mindful living* 🪷✨
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
