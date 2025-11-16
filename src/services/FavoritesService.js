// FavoritesService.js - Save favorite playlists to Firebase

import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getCurrentUser } from './SpotifyAuth';

/**
 * Add playlist to favorites
 */
export async function addFavorite(playlist) {
    try {
        const spotifyUser = await getCurrentUser();
        
        // Check if already favorited
        const existing = await getFavorites();
        if (existing.some(fav => fav.playlistId === playlist.id)) {
            console.log('Already in favorites');
            return;
        }

        const favoriteData = {
            userId: spotifyUser.id,
            playlistId: playlist.id,
            playlistName: playlist.name,
            playlistImage: playlist.imageUrl,
            playlistOwner: playlist.owner,
            playlistUri: playlist.uri,
            timestamp: Date.now(),
        };

        await addDoc(collection(db, 'favorites'), favoriteData);
        console.log('Added to favorites');
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
}

/**
 * Remove playlist from favorites
 */
export async function removeFavorite(playlistId) {
    try {
        const spotifyUser = await getCurrentUser();
        
        const q = query(
            collection(db, 'favorites'),
            where('userId', '==', spotifyUser.id),
            where('playlistId', '==', playlistId)
        );

        const snapshot = await getDocs(q);
        
        snapshot.forEach(async (document) => {
            await deleteDoc(doc(db, 'favorites', document.id));
        });

        console.log('Removed from favorites');
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}

/**
 * Get all favorite playlists
 */
export async function getFavorites() {
    try {
        const spotifyUser = await getCurrentUser();
        
        const q = query(
            collection(db, 'favorites'),
            where('userId', '==', spotifyUser.id)
        );

        const snapshot = await getDocs(q);
        
        const favorites = [];
        snapshot.forEach(doc => {
            favorites.push({
                id: doc.id,
                playlistId: doc.data().playlistId,
                name: doc.data().playlistName,
                imageUrl: doc.data().playlistImage,
                owner: doc.data().playlistOwner,
                uri: doc.data().playlistUri,
                timestamp: doc.data().timestamp,
            });
        });

        // Sort by most recent
        return favorites.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

/**
 * Check if playlist is favorited
 */
export async function isFavorited(playlistId) {
    try {
        const favorites = await getFavorites();
        return favorites.some(fav => fav.playlistId === playlistId);
    } catch (error) { // <-- Use the 'error' variable here
        console.error("Error checking if playlist is favorited:", error);
        return false;
    }
}