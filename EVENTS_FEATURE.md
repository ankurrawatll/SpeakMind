# Events Feature - Community Tab

## Overview
The **Community Tab** (formerly "Sharing" tab) now includes an **Events** feature that allows users to create and discover real-life mental wellness meetups in their city.

## Features Implemented

### 1. **Tab Renaming**
- ✅ Renamed "Sharing" to "Community" in the bottom navigation
- ✅ The screen ID remains `sharing` for backward compatibility

### 2. **Three-Tab System**
The Community screen now has three tabs:
- **Forum** - Share experiences and discussions
- **Support Chat** - One-on-one conversations
- **Events** - Real-life meetups and events *(NEW)*

### 3. **Events Tab Components**

#### City Selector
- Dropdown menu at the top with 25 major Indian cities
- Cities include: Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, and more
- Events are filtered by selected city

#### Event Creation
- **Floating + Button** - Fixed at bottom-right corner
- **Creation Modal** with fields:
  - Event Title (e.g., "Meditation Group Session")
  - Address (full address with landmarks)
  - City (auto-filled from selected city)
  - Date (date picker with minimum date as today)
  - Time (time picker)
- **Validation**: 
  - All fields required
  - Event date/time must be in the future
  - User must be logged in

#### Event Display
- **Event Cards** showing:
  - Event title
  - Organizer name
  - Full address with location icon
  - Date in readable format (e.g., "Monday, January 15, 2024")
  - Time in 12-hour format
  - Creation date
  - "Your Event" badge for events created by current user
- **Empty State**: Encouraging message when no events exist
- **Sorting**: Events displayed chronologically (earliest first)

### 4. **Firebase Integration**

#### Firestore Structure
```
events (collection)
  └── [eventId] (document)
      ├── title: string
      ├── address: string
      ├── city: string
      ├── dateTime: Timestamp
      ├── creatorId: string
      ├── creatorName: string
      └── createdAt: Timestamp
```

#### Real-time Updates
- Uses Firestore `onSnapshot` for live event updates
- Events automatically appear when created by any user
- No page refresh needed

#### Auto-deletion
- Background process checks every minute for expired events
- Events are automatically deleted from Firestore when their dateTime has passed
- Ensures the event list stays current

### 5. **User Experience**

#### Authentication
- Non-logged-in users can view events
- Must be logged in to create events
- Alert shown if attempting to create without login

#### Visual Design
- **Consistent with app theme**: Glass-morphism design with backdrop blur
- **Color scheme**: Purple primary color matching the app
- **Icons**: Emoji-based for accessibility and visual appeal
- **Responsive**: Works on mobile and desktop
- **Animations**: Hover effects and scale transitions

#### Information Box
Help section explaining:
- Purpose of events
- Real-life meetup connectivity
- Auto-expiration feature

## Technical Implementation

### Dependencies Used
- `firebase/firestore` - Database operations
- `firebase/auth` - User authentication
- React hooks: `useState`, `useEffect`
- Context: `useAuth` for current user

### Key Functions

1. **handleCreateEvent()**
   - Validates all fields
   - Checks date is in future
   - Adds event to Firestore
   - Resets form and closes modal

2. **useEffect for fetching events**
   - Queries events by selected city
   - Sets up real-time listener
   - Unsubscribes on cleanup

3. **useEffect for auto-deletion**
   - Runs every minute
   - Compares event dateTime with current time
   - Deletes expired events

## Usage Instructions

### For Users
1. Navigate to Community tab (👥 icon)
2. Click "Events" tab
3. Select your city from dropdown
4. View available events or create new one
5. Click floating + button to create event
6. Fill in all details and submit

### For Developers

#### To modify cities list:
Edit the `INDIAN_CITIES` array in `SharingScreen.tsx`:
```typescript
const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  // ... add more cities
]
```

#### To change auto-deletion interval:
Modify the interval in the cleanup useEffect:
```typescript
const interval = setInterval(checkAndDeleteExpiredEvents, 60000) // 60000ms = 1 minute
```

## Future Enhancements

Potential improvements:
- [ ] Event RSVP system
- [ ] Participant count
- [ ] Event categories (meditation, yoga, therapy sessions, etc.)
- [ ] Push notifications for upcoming events
- [ ] Event cancellation by creator
- [ ] Google Maps integration
- [ ] Event image upload
- [ ] Search and filter options
- [ ] User reviews/ratings after event

## Security Considerations

### Current Implementation
- Users can only see "Your Event" badge on their own events
- No edit/delete UI for other users' events
- Firebase Security Rules should be implemented

### Recommended Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Anyone can read events
      allow read: if true;
      
      // Only authenticated users can create events
      allow create: if request.auth != null 
        && request.resource.data.creatorId == request.auth.uid;
      
      // Only creator can update/delete their events
      allow update, delete: if request.auth != null 
        && resource.data.creatorId == request.auth.uid;
    }
  }
}
```

## Testing Checklist

- [x] Build compiles without errors
- [ ] Events are created successfully
- [ ] Events display correctly for selected city
- [ ] City selector changes filter events
- [ ] Expired events are deleted automatically
- [ ] Modal opens and closes properly
- [ ] Form validation works
- [ ] Real-time updates work across users
- [ ] Responsive design on mobile
- [ ] Authentication check works

## Files Modified

1. **src/screens/SharingScreen.tsx**
   - Added Events tab
   - Implemented event creation modal
   - Added Firestore integration
   - Added auto-deletion logic
   - Added city selector

2. **src/components/BottomNavigation.tsx**
   - Already shows "Community" label (no changes needed)

3. **src/config/firebase.ts**
   - Already configured (no changes needed)

## Dependencies

All required dependencies are already installed:
- firebase@^10.x
- react@^18.x
- React context for auth

## Notes

- The screen ID remains `sharing` in `App.tsx` for backward compatibility
- Events are stored per-city in a single collection with city field for filtering
- The feature uses the existing Firebase configuration from `.env.local`
- No database migration needed - collection is created automatically

---

**Created**: October 19, 2025  
**Version**: 1.0  
**Status**: ✅ Implemented and Build Successful
