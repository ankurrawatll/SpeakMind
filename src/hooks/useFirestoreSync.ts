/**
 * Firestore Sync Hook
 * Syncs localStorage data with Firestore for offline-first approach
 * Falls back to localStorage if Firestore is unavailable
 */

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as firestoreService from '../services/firestore.service'

interface SyncStatus {
  syncing: boolean
  lastSync: Date | null
  error: string | null
}

export const useFirestoreSync = () => {
  const { currentUser } = useAuth()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    syncing: false,
    lastSync: null,
    error: null
  })

  // Sync user profile on mount
  useEffect(() => {
    if (!currentUser) return

    const syncUserProfile = async () => {
      try {
        setSyncStatus(prev => ({ ...prev, syncing: true, error: null }))
        
        // Check if profile exists
        let profile = await firestoreService.getUserProfile(currentUser.uid)
        
        if (!profile) {
          // Create profile from auth data
          await firestoreService.createUserProfile(currentUser.uid, {
            displayName: currentUser.displayName || 'User',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || undefined,
            onboardingCompleted: false
          })
        }
        
        // Migrate localStorage onboarding status
        const localOnboarding = localStorage.getItem(`speakmind_user_onboarding_${currentUser.uid}`)
        if (localOnboarding && profile && !profile.onboardingCompleted) {
          await firestoreService.updateUserProfile(currentUser.uid, {
            onboardingCompleted: true
          })
        }
        
        setSyncStatus({
          syncing: false,
          lastSync: new Date(),
          error: null
        })
      } catch (error) {
        console.error('Error syncing user profile:', error)
        setSyncStatus({
          syncing: false,
          lastSync: null,
          error: error instanceof Error ? error.message : 'Sync failed'
        })
      }
    }

    syncUserProfile()
  }, [currentUser])

  return syncStatus
}

/**
 * Hook for syncing meditation stats
 */
export const useMeditationStats = () => {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState<firestoreService.UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    const loadStats = async () => {
      try {
        setLoading(true)
        const userStats = await firestoreService.getUserStats(currentUser.uid)
        setStats(userStats)
        
        // Migrate localStorage data if needed
        await migrateLocalStorageStats(currentUser.uid, userStats)
      } catch (error) {
        console.error('Error loading meditation stats:', error)
        // Fallback to localStorage
        loadStatsFromLocalStorage()
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [currentUser])

  const loadStatsFromLocalStorage = () => {
    try {
      const meditatedDates = JSON.parse(
        localStorage.getItem('speakmind_meditation_dates') || '[]'
      )
      const shields = Number(localStorage.getItem('speakmind_shields') || '0')
      
      setStats({
        userId: currentUser?.uid || '',
        totalSessions: meditatedDates.length,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastMeditationDate: meditatedDates[meditatedDates.length - 1] || '',
        meditatedDates,
        shields,
        level: 1,
        points: 0,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
      })
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  const migrateLocalStorageStats = async (
    userId: string,
    currentStats: firestoreService.UserStats | null
  ) => {
    if (!currentStats || currentStats.totalSessions > 0) return

    try {
      const meditatedDates = JSON.parse(
        localStorage.getItem('speakmind_meditation_dates') || '[]'
      )
      const shields = Number(localStorage.getItem('speakmind_shields') || '0')
      
      if (meditatedDates.length > 0 || shields > 0) {
        // Migrate data to Firestore
        const statsRef = await firestoreService.getUserStats(userId)
        if (statsRef) {
          // Update with localStorage data
          console.log('Migrating localStorage stats to Firestore')
          // This would require additional update logic
        }
      }
    } catch (error) {
      console.error('Error migrating localStorage stats:', error)
    }
  }

  return { stats, loading }
}

/**
 * Hook for saving meditation sessions
 */
export const useSaveMeditationSession = () => {
  const { currentUser } = useAuth()
  const [saving, setSaving] = useState(false)

  const saveSession = async (
    duration: number,
    type: 'guided' | 'timer' | 'breathing' | 'exercise',
    exerciseId?: string,
    mood?: string
  ) => {
    if (!currentUser) {
      console.warn('Cannot save session: user not authenticated')
      return null
    }

    try {
      setSaving(true)
      const sessionId = await firestoreService.saveMeditationSession({
        userId: currentUser.uid,
        duration,
        type,
        exerciseId,
        mood,
        completedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
      })
      
      return sessionId
    } catch (error) {
      console.error('Error saving meditation session:', error)
      // Fallback: save to localStorage
      saveSessionToLocalStorage(duration, type)
      return null
    } finally {
      setSaving(false)
    }
  }

  const saveSessionToLocalStorage = (
    duration: number,
    type: string
  ) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const meditatedDates = JSON.parse(
        localStorage.getItem('speakmind_meditation_dates') || '[]'
      )
      
      if (!meditatedDates.includes(today)) {
        meditatedDates.push(today)
        localStorage.setItem('speakmind_meditation_dates', JSON.stringify(meditatedDates))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return { saveSession, saving }
}
