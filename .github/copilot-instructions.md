
# SpeakMind AI Coding Agent Instructions

## Project Overview
SpeakMind is a mobile-first mental wellness app built with React (TypeScript), Vite, and Tailwind CSS. It features AI-powered meditation coaching, mood tracking, journaling, and community sharing. The UI uses glassmorphism, gradients, and emoji-based icons for a modern, engaging experience.

## Architecture & Key Patterns
- **Screens**: Each major feature (Meditation, Journal, Emotional Release, Mind Coach, etc.) is a separate React component in `src/screens/`. Navigation is managed via props and a central `Screen` type.
- **State**: Local state via React hooks (`useState`, `useEffect`). No global state manager; context is used for authentication and user context (`src/contexts/`, `src/utils/userContext.ts`).
- **AI Integration**: Gemini AI API is called via `src/utils/geminiAPI.ts`. Fallback responses are provided if the API fails. Always validate API keys and handle errors gracefully.
- **Video Recommendations**: YouTube API is used for personalized meditation/music suggestions (`src/utils/youtubeAI.ts`). Search queries are context-aware, using recent user conversations and mood selection.
- **Firebase**: Authentication and Firestore are initialized in `src/config/firebase.ts`. Environment variables are required; validate them at runtime and warn if missing/invalid.
- **Styling**: Tailwind CSS is used throughout. Use utility classes for layout, gradients, and responsive design. Components like `card`, `btn-primary`, and `gradient-bg` are common.
- **Navigation**: Bottom navigation is implemented in `src/components/BottomNavigation.tsx` with emoji/icons and touch-optimized buttons.

## Developer Workflows
- **Install**: `npm install` (Node.js 20.19+ or 22.12+ recommended)
- **Start Dev Server**: `npm run dev` (default port: 5174)
- **Build**: `npm run build` (optimized with lazy loading and code splitting)
- **Firebase Setup**: Copy `.env.example` to `.env` and fill in Firebase, YouTube, and Gemini API keys. See `src/config/firebase.ts` for required variables and validation logic.
- **Mobile-First**: Test in mobile viewport (375px width). All screens/components are optimized for touch and mobile.
- **Performance**: Lazy loading enabled for all screens and components. Manual chunk splitting configured in `vite.config.ts`.

## Project-Specific Conventions
- **Session State**: Breathing/meditation sessions use local state machines (`selection`, `active`, `paused`, `completed`).
- **XP & Progress**: Completing sessions awards XP, tracked per user. UI feedback via toasts and summary cards.
- **Contextual AI**: User context (recent questions, moods, topics) is stored in localStorage and used for personalized recommendations.
- **Error Handling**: Always provide user-friendly fallbacks for API/network errors (see `geminiAPI.ts` and video recommendation logic).
- **Component Patterns**: Use functional components, props for navigation, and Tailwind for styling. Avoid class components and global state libraries.

## Integration Points
- **Gemini AI**: `src/utils/geminiAPI.ts` (wellness Q&A, fallback logic)
- **YouTube API**: `src/utils/youtubeAI.ts` (video suggestions)
- **Firebase**: `src/config/firebase.ts` (auth, Firestore)
- **User Context**: `src/utils/userContext.ts` (conversation history, topic extraction)

## Examples
- **Screen Navigation**: Pass `onNavigate` prop to screens; use `Screen` type for routing.
- **Breathing Session**: See `EmotionalReleaseScreen.tsx` for state machine and animation logic.
- **Video Suggestions**: See `HomeScreen.tsx` for context-aware video recommendation flow.

## References
- **README.md**: Full feature list, setup, and design system
- **src/screens/**: Main feature implementations
- **src/components/**: Shared UI components
- **src/utils/**: API integrations and context logic
- **src/config/**: External service setup

---
If any section is unclear or missing, please provide feedback so instructions can be improved for future AI agents.