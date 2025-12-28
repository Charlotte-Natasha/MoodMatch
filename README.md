# 🎵 MoodMatch

A mood-based music discovery app that recommends and plays Spotify playlists based on your current emotional state. Select your mood and instantly get personalized music recommendations.

## ✨ Features

- **Mood-Based Discovery** — Choose from 6 moods: Chill, Energetic, Focused, Happy, Romantic, and Sad
- **Spotify Integration** — Direct playback with Spotify Web Player
- **User Authentication** — Secure OAuth 2.0 login with Spotify
- **Favorites** — Save and manage your favorite playlists
- **User Profiles** — Custom profile management with image uploads
- **Playback History** — Track your listening history
- **Firebase Persistence** — Cloud-based user data storage

## 🛠️ Tech Stack

- **Frontend** — React 18, Vite, Tailwind CSS
- **Authentication** — Spotify OAuth 2.0
- **Music API** — Spotify Web API
- **Database** — Firebase Firestore
- **State Management** — React Context API
- **Code Quality** — ESLint

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MoodMatch
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

### Pages

- **WelcomeScreen** — Landing page with app introduction
- **SpotifyLogin** — Spotify OAuth authentication page
- **SpotifyCallback** — OAuth callback handler
- **Moods** — Main mood selection interface
- **MoodPage** — Mood-specific playlist display (6 mood variants)
- **Playlist** — Detailed playlist view
- **Favorites** — Saved playlists management
- **Profile** — User profile and settings
- **EditProfile** — Profile customization

### Components

- **SpotifyPlayer** — Audio player interface
- **SpotifyWebPlayer** — Web player integration
- **PlaylistDetails** — Playlist information and tracks
- **History** — Listening history display

### Contexts & Hooks

- **AuthContext/AuthProvider** — User authentication state
- **PlaybackContext** — Music playback management
- **WebPlayerContext** — Web player state
- **useFavorites** — Manage favorite playlists
- **useFetchPlaylists** — Fetch mood-based playlists
- **useMoodPlaylists** — Mood playlist selection logic
- **usePlaylistTracks** — Track management

### Services

- **SpotifyAuth** — OAuth 2.0 authentication
- **MusicService** — Spotify API integration
- **FavoritesService** — Favorites management

### Firebase

- **firebaseConfig** — Firebase app initialization
- **firebaseTracking** — User activity tracking

## 🎯 Key Features Explained

### Mood Selection

Users select their current mood and receive curated Spotify playlists:

- 🎸 **Energetic** — High-energy tracks to boost your mood
- 😎 **Chill** — Relaxing vibes for unwinding
- 🧠 **Focused** — Concentration-friendly music
- 😊 **Happy** — Uplifting and positive songs
- 💕 **Romantic** — Love and passion-filled tracks
- 😢 **Sad** — Emotional and introspective music

### Spotify Integration

- Direct Web Player embedding for seamless playback
- Real-time playlist fetching from Spotify
- User library integration

### User Persistence

- Firebase Firestore stores user preferences
- Favorites sync across sessions
- Profile customization with image uploads

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🔐 Authentication Flow

1. User clicks "Login with Spotify"
2. Redirected to Spotify authorization page
3. User approves app permissions
4. Redirect to callback page with auth code
5. Exchange code for access token
6. Store token and initialize user session
7. Access granted to user data and playlists

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
