// FirebaseTracking.js - Track mood plays and listening history

import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getCurrentUser } from '../services/SpotifyAuth';

/**
 * Save a play event to Firebase
 */
export async function trackPlay(trackInfo, mood) {
    try {
        const spotifyUser = await getCurrentUser();
        
        const playData = {
            userId: spotifyUser.id, // Spotify user ID
            trackName: trackInfo.title,
            artist: trackInfo.artist,
            trackUri: trackInfo.uri,
            mood: mood.toLowerCase(), // e.g., 'happy', 'sad'
            timestamp: Date.now(),
            date: new Date().toISOString(),
        };

        await addDoc(collection(db, 'plays'), playData);
        console.log('Play tracked:', playData);
    } catch (error) {
        console.error('Error tracking play:', error);
        // Don't throw - we don't want tracking to break playback
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
            history.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return history;
    } catch (error) {
        console.error('Error getting Firebase history:', error);
        return [];
    }
}