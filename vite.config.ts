import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'icons-vendor': ['react-icons', 'lucide-react'],
          // Screens chunked by feature
          'auth-screens': [
            './src/screens/AuthScreen.tsx',
            './src/screens/UserOnboardingScreen.tsx',
          ],
          'home-screens': [
            './src/screens/HomeScreen.tsx',
            './src/screens/ProfileScreen.tsx',
          ],
          'meditation-screens': [
            './src/screens/MeditationScreen.tsx',
            './src/screens/MeditationTimerScreen.tsx',
            './src/screens/EmotionalReleaseScreen.tsx',
          ],
          'ai-screens': [
            './src/screens/AICoachScreen.tsx',
            './src/screens/ConversationScreen.tsx',
            './src/screens/AskQuestionScreen.tsx',
            './src/screens/MindCoachScreen.tsx',
          ],
          'content-screens': [
            './src/screens/VedicCalmScreen.tsx',
            './src/screens/WisdomGitaScreen.tsx',
            './src/screens/MidnightRelaxationScreen.tsx',
            './src/screens/MidnightLaunderetteScreen.tsx',
          ],
          'exercise-components': [
            './src/components/exercises/QuickCalm.tsx',
            './src/components/exercises/StretchAndFocus.tsx',
            './src/components/exercises/MindBodySync.tsx',
            './src/components/exercises/ReflectionJournal.tsx',
          ],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3000,
    open: true,
  },
})
