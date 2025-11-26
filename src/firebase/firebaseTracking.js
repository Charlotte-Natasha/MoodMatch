// FirebaseTracking.js - Track mood plays and listening history

import { db } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, limit, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { getCurrentUser } from '../services/SpotifyAuth';

/**
 * Save a play event to Firebase
 */
export async function trackPlay(trackInfo, mood) {
    try {
        const spotifyUser = await getCurrentUser();
        
        const playData = {
            userId: spotifyUser.id,
            trackName: trackInfo.title,
            artist: trackInfo.artist,
            trackUri: trackInfo.uri,
            albumImage: trackInfo.albumImage || trackInfo.image || '',
            album: trackInfo.album || '',
            mood: mood.toLowerCase(),
            timestamp: Timestamp.now(),
            date: new Date().toISOString(),
        };

        await addDoc(collection(db, 'plays'), playData);
        console.log('Play tracked:', playData);

        // Clean up old history in background (don't wait for it)
        cleanupOldHistory(spotifyUser.id).catch(err => 
            console.warn('History cleanup failed (non-critical):', err)
        );
    } catch (error) {
        console.error('Error tracking play:', error);
        // Don't throw - we don't want tracking to break playback
    }
}

/**
 * Clean up history older than specified days (default: 30 days)
 */
async function cleanupOldHistory(userId, daysToKeep = 30) {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

        // Note: This query needs a composite index on (userId, timestamp)
        const q = query(
            collection(db, 'plays'),
            where('userId', '==', userId),
            where('timestamp', '<', cutoffTimestamp)
        );

        const snapshot = await getDocs(q);
        
        // Delete old documents
        const deletePromises = snapshot.docs.map(docSnapshot => 
            deleteDoc(doc(db, 'plays', docSnapshot.id))
        );

        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
            console.log(`Cleaned up ${deletePromises.length} old play records`);
        }
    } catch (error) {
        // Silently fail cleanup - don't block the main tracking
        console.warn('Cleanup failed:', error);
    }
}

/**
 * Get mood play counts for current user
 */
export async function getMoodStats() {
    try {
        const spotifyUser = await getCurrentUser();
        
        const q = query(
            collection(db, 'plays'),
            where('userId', '==', spotifyUser.id)
        );

        const snapshot = await getDocs(q);
        
        // Count plays per mood
        const moodCounts = {};
        snapshot.forEach(doc => {
            const mood = doc.data().mood;
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        // Convert to array and sort
        const stats = Object.entries(moodCounts).map(([mood, count]) => ({
            mood,
            count
        })).sort((a, b) => b.count - a.count);

        return stats;
    } catch (error) {
        console.error('Error getting mood stats:', error);
        return [];
    }
}

/**
 * Get recent plays from Firebase (for history)
 */
export async function getFirebaseHistory(limitCount = 50) {
    try {
        const spotifyUser = await getCurrentUser();
        
        const q = query(
            collection(db, 'plays'),
            where('userId', '==', spotifyUser.id),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        
        const history = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            history.push({
                id: doc.id,
                trackName: data.trackName,
                artist: data.artist,
                albumImage: data.albumImage,
                album: data.album,
                mood: data.mood,
                trackUri: data.trackUri,
                // Convert Firestore Timestamp to JS Date
                timestamp: data.timestamp?.toDate?.() || new Date(data.date),
                date: data.date
            });
        });

        return history;
    } catch (error) {
        console.error('Error getting Firebase history:', error);
        throw error; // Let's History.jsx handle the error display
    }
}