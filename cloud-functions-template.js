/**
 * Firebase Cloud Function for Auto-Deleting Expired Events
 * 
 * This function runs daily and deletes all events whose dateTime has passed.
 * This is more efficient than client-side deletion.
 * 
 * To deploy:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Initialize functions: firebase init functions
 * 3. Copy this code to functions/index.js
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Scheduled function that runs every day at midnight (UTC)
 * to delete expired events
 */
exports.deleteExpiredEvents = functions.pubsub
  .schedule('0 0 * * *') // Runs every day at midnight UTC
  .timeZone('Asia/Kolkata') // IST timezone
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    
    try {
      // Query for all expired events
      const expiredEventsQuery = db.collection('events')
        .where('dateTime', '<', now);
      
      const snapshot = await expiredEventsQuery.get();
      
      if (snapshot.empty) {
        console.log('No expired events found');
        return null;
      }
      
      // Delete all expired events in a batch
      const batch = db.batch();
      let count = 0;
      
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });
      
      await batch.commit();
      
      console.log(`Successfully deleted ${count} expired events`);
      return null;
      
    } catch (error) {
      console.error('Error deleting expired events:', error);
      throw error;
    }
  });

/**
 * Alternative: Run more frequently (every hour)
 * Uncomment this and comment out the above if you need more frequent cleanup
 */
/*
exports.deleteExpiredEventsHourly = functions.pubsub
  .schedule('0 * * * *') // Runs every hour
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    // Same implementation as above
  });
*/

/**
 * HTTP Triggered function for manual cleanup
 * Call this endpoint to manually trigger expired event deletion
 * Example: https://your-region-your-project.cloudfunctions.net/cleanupExpiredEvents
 */
exports.cleanupExpiredEvents = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  
  try {
    const expiredEventsQuery = db.collection('events')
      .where('dateTime', '<', now);
    
    const snapshot = await expiredEventsQuery.get();
    
    if (snapshot.empty) {
      res.json({ 
        success: true, 
        message: 'No expired events found',
        deletedCount: 0 
      });
      return;
    }
    
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });
    
    await batch.commit();
    
    res.json({ 
      success: true, 
      message: `Successfully deleted ${count} expired events`,
      deletedCount: count 
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Firestore Trigger - Delete event when it expires
 * This approach uses a Firestore trigger combined with a timestamp check
 * Less efficient but provides immediate cleanup
 */
exports.onEventUpdate = functions.firestore
  .document('events/{eventId}')
  .onUpdate(async (change, context) => {
    const eventData = change.after.data();
    const now = admin.firestore.Timestamp.now();
    
    // Check if event has expired
    if (eventData.dateTime < now) {
      console.log(`Event ${context.params.eventId} has expired, deleting...`);
      await change.after.ref.delete();
    }
    
    return null;
  });
