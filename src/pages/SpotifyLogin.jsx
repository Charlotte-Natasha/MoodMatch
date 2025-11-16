import React from "react";
import { loginWithSpotify } from "../services/SpotifyAuth";

const SpotifyLoginPage = () => {
  const handleSpotifyLogin = () => {
    // This will redirect to Spotify's login page
    loginWithSpotify();
  };

  // Icon for Spotify logo (or just the S) for the button
  const SpotifyIcon = (props) => (
    <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );

  // Checkmark Icon for features list
  const CheckIcon = (props) => (
    <svg className={props.className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        // RESTORED: Your original custom dark purple gradient
        background:
          "linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)",
      }}
    >
      {/* Animated background blobs (Kept the colors, adjusted opacity) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-30"></div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Login Card: Retaining the improved glass/dark style */}
        <div className="bg-black/20 backdrop-blur-3xl rounded-3xl p-8 md:p-12 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="text-center mb-10">
            {/* Using the Spotify Icon's color for visual branding */}
            <div className="mb-4">
              <span className="text-7xl text-green-400">
                <SpotifyIcon className="w-16 h-16 mx-auto" />
              </span>
            </div>
            <h1 className="text-white text-4xl font-extrabold tracking-tight mb-3">
              Unlock Your Music Discovery
            </h1>
            <p className="text-white/70 text-lg font-light">
              Connect your Spotify account to access personalized music
              insights.
            </p>
          </div>

          {/* Features List: Retaining the improved style */}
          <div className="space-y-4 mb-10">
            {/* Feature Item 1 */}
            <div className="flex items-start gap-3 text-white">
              <div className="shrink-0 w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center mt-0.5">
                <CheckIcon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Full Music Library
                </h3>
                <p className="text-white/60 text-base">
                  Access millions of songs and your saved playlists.
                </p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="flex items-start gap-3 text-white">
              <div className="shrink-0 w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center mt-0.5">
                <CheckIcon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Mood-Based Discovery
                </h3>
                <p className="text-white/60 text-base">
                  Get new, unique playlists based on your listening habits.
                </p>
              </div>
            </div>

            {/* Feature Item 3 */}
            <div className="flex items-start gap-3 text-white">
              <div className="shrink-0 w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center mt-0.5">
                <CheckIcon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Seamless Integration
                </h3>
                <p className="text-white/60 text-base">
                  Control music right from our app via Spotify Connect.
                </p>
              </div>
            </div>
          </div>

          {/* Login Button: Retaining the highly contrasted button style */}
          <button
            onClick={handleSpotifyLogin}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-extrabold py-4 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-2xl hover:shadow-green-500/70 flex items-center justify-center gap-3"
          >
            <SpotifyIcon className="w-7 h-7" />
            Log in to Spotify
          </button>

          {/* Info Block */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center mt-6">
            <p className="text-white/50 text-sm">
              <span className="font-bold text-green-400">Spotify Premium</span>{" "}
              is recommended for full music playback control.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-white/30 text-center text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Keeping custom styles for animation */}
      <style jsx>{`
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default SpotifyLoginPage;
