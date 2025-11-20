# Firebase Implementation Examples

## Quick Start Guide

### 1. Update App.tsx to Use Firestore Sync

```typescript
import { useFirestoreSync } from './hooks/useFirestoreSync'

const AppContent = () => {
  const { currentUser } = useAuth()
  
  // Add this line to enable automatic sync
  const syncStatus = useFirestoreSync()
  
  // Rest of your component...
}
```

### 2. Update StreaksScreen to Use Firestore

**Before (localStorage):**
```typescript
const [meditatedDates, setMeditatedDates] = useState<string[]>(() => {
  const raw = localStorage.getItem('speakmind_meditation_dates')
  return raw ? JSON.parse(raw) : []
})
```

**After (Firestore with fallback):**
```typescript
import { useMeditationStats } from '../hooks/useFirestoreSync'

const StreaksScreen = ({ onNavigate, user }: StreaksScreenProps) => {
  const { stats, loading } = useMeditationStats()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  const meditatedDates = stats?.meditatedDates || []
  const currentStreak = stats?.currentStreak || 0
  const shields = stats?.shields || 0
  
  // Rest of component...
}
```

### 3. Update MeditationTimerScreen to Save Sessions

**Add to MeditationTimerScreen.tsx:**
```typescript
import { useSaveMeditationSession } from '../hooks/useFirestoreSync'

const MeditationTimerScreen = ({ onNavigate }: MeditationTimerScreenProps) => {
  const { saveSession, saving } = useSaveMeditationSession()
  
  const handleComplete = async () => {
    setIsComplete(true)
    
    // Save session to Firestore
    await saveSession(
      duration, // duration in minutes
      'timer', // type: 'timer' | 'guided' | 'breathing' | 'exercise'
      undefined, // exerciseId (optional)
      selectedMood // mood (optional)
    )
    
    // Show completion screen...
  }
  
  // Rest of component...
}
```

### 4. Update ProfileScreen to Show Firestore Stats

**Add to ProfileScreen.tsx:**
```typescript
import { useMeditationStats } from '../hooks/useFirestoreSync'

const ProfileScreen = ({ onNavigate, user }: ProfileScreenProps) => {
  const { stats, loading } = useMeditationStats()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return (
    <div>
      <StatCard 
        label="Total Sessions" 
        value={stats?.totalSessions || 0} 
      />
      <StatCard 
        label="Total Minutes" 
        value={stats?.totalMinutes || 0} 
      />
      <StatCard 
        label="Current Streak" 
        value={stats?.currentStreak || 0} 
      />
      <StatCard 
        label="Level" 
        value={stats?.level || 1} 
      />
      <StatCard 
        label="Points" 
        value={stats?.points || 0} 
      />
    </div>
  )
}
```

### 5. Update JournalScreen to Use Firestore

**Add journal saving:**
```typescript
import { saveJournalEntry } from '../services/firestore.service'
import { useAuth } from '../contexts/AuthContext'

const JournalScreen = ({ onNavigate, user }: JournalScreenProps) => {
  const { currentUser } = useAuth()
  const [saving, setSaving] = useState(false)
  
  const handleSaveEntry = async (content: string, mood?: string) => {
    if (!currentUser) return
    
    try {
      setSaving(true)
      await saveJournalEntry({
        userId: currentUser.uid,
        content,
        mood,
        tags: extractTags(content) // optional
      })
      
      // Show success message
      alert('Journal entry saved!')
    } catch (error) {
      console.error('Error saving journal:', error)
      // Fallback to localStorage
      saveToLocalStorage(content)
    } finally {
      setSaving(false)
    }
  }
  
  // Rest of component...
}
```

### 6. Update Exercise Components to Track Progress

**Add to QuickCalm.tsx, StretchAndFocus.tsx, etc:**
```typescript
import { useSaveMeditationSession } from '../hooks/useFirestoreSync'

const QuickCalm = ({ onNavigate }: ExerciseProps) => {
  const { saveSession } = useSaveMeditationSession()
  
  const handleComplete = async () => {
    // Save exercise completion
    await saveSession(
      5, // 5 minutes
      'exercise',
      'quick-calm', // exerciseId
      'calm' // mood
    )
    
    // Navigate back
    onNavigate('meditation')
  }
  
  // Rest of component...
}
```

## Testing Your Implementation

### 1. Test User Profile Creation
```typescript
// In browser console after signup:
import { getUserProfile } from './services/firestore.service'
const profile = await getUserProfile('your-user-id')
console.log(profile)
```

### 2. Test Meditation Session Saving
```typescript
// Complete a meditation session and check Firestore:
// Firebase Console > Firestore Database > meditationSessions
// Should see new document with your session data
```

### 3. Test Offline Mode
```typescript
// 1. Open DevTools > Network tab
// 2. Set to "Offline"
// 3. Complete a meditation session
// 4. Check localStorage (should have data)
// 5. Go back online
// 6. Refresh page
// 7. Check Firestore (should sync data)
```

### 4. Test Stats Calculation
```typescript
// Complete multiple sessions and verify:
// - Streak increases for consecutive days
// - Points accumulate (10 points per minute)
// - Level increases (every 1000 points)
// - Total sessions and minutes update
```

## Common Issues & Solutions

### Issue: "Permission denied" error
**Solution:** Deploy the updated Firestore rules:
```bash
cp firestore.rules.updated firestore.rules
firebase deploy --only firestore:rules
```

### Issue: Data not syncing
**Solution:** Check Firebase Console > Firestore Database
- Verify collections exist
- Check security rules
- Verify user is authenticated

### Issue: Offline persistence not working
**Solution:** Check browser console for errors
- Some browsers don't support IndexedDB
- Multiple tabs can cause issues
- Clear browser cache and try again

### Issue: Build size increased
**Solution:** This is expected due to Firestore SDK
- Before: ~468 KB (firebase-vendor)
- After: ~546 KB (firebase-vendor)
- Increase: ~78 KB (gzipped: ~20 KB)
- Worth it for cloud sync and offline support

## Performance Tips

### 1. Use Query Limits
```typescript
// Always limit queries to prevent excessive reads
const sessions = await getUserMeditationSessions(userId, 10) // limit to 10
```

### 2. Cache Frequently Accessed Data
```typescript
// Use React state to cache data
const [stats, setStats] = useState<UserStats | null>(null)

useEffect(() => {
  // Only fetch once on mount
  if (!stats) {
    loadStats()
  }
}, [])
```

### 3. Batch Operations
```typescript
// Instead of multiple writes, batch them:
import { writeBatch, doc } from 'firebase/firestore'

const batch = writeBatch(db)
batch.set(doc(db, 'collection', 'doc1'), data1)
batch.set(doc(db, 'collection', 'doc2'), data2)
await batch.commit()
```

### 4. Use Offline Persistence
```typescript
// Already enabled in firebase.ts
// Reduces reads by 70-90%
```

## Migration Checklist

- [ ] Deploy updated Firestore rules
- [ ] Add `useFirestoreSync()` to App.tsx
- [ ] Update StreaksScreen to use `useMeditationStats()`
- [ ] Update MeditationTimerScreen to use `useSaveMeditationSession()`
- [ ] Update ProfileScreen to show Firestore stats
- [ ] Update JournalScreen to save to Firestore
- [ ] Update exercise components to track progress
- [ ] Test offline mode
- [ ] Test data sync across devices
- [ ] Monitor Firestore usage in console
- [ ] Update documentation

## Next Steps

1. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Test in Development**
   - Complete a meditation session
   - Check Firestore Console
   - Verify data appears

3. **Test Offline Mode**
   - Go offline
   - Complete a session
   - Go back online
   - Verify sync

4. **Deploy to Production**
   ```bash
   npm run build
   vercel --prod
   ```

5. **Monitor Usage**
   - Firebase Console > Usage
   - Check read/write counts
   - Optimize if needed

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Firebase Console for Firestore errors
3. Verify security rules are deployed
4. Test with Firebase Emulator locally
5. Check FIREBASE_IMPROVEMENTS.md for detailed docs
