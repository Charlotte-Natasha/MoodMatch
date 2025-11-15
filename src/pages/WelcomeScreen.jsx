import React from "react";
import { useNavigate } from "react-router-dom";
import MusicArt from "../assets/logo2.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to Spotify login page
    navigate("/spotify-login");
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)',
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fadeIn">
          <div className="mb-4">
            <span className="text-6xl">🎵</span>
          </div>
          <h1 className="text-white text-6xl md:text-7xl font-extrabold mb-4 tracking-tight">
            MOODMATCH
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-md mx-auto leading-relaxed">
            Discover music perfectly tailored to your mood
          </p>
        </header>

        {/* Music Art Image */}
        <div className="mb-12 animate-fadeIn animation-delay-200">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-30"></div>
            <img
              src={MusicArt}
              alt="MoodMatch Music Art"
              className="relative w-full max-w-sm h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl animate-fadeIn animation-delay-400">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-3">😊</div>
            <h3 className="text-white font-semibold mb-2">Mood-Based</h3>
            <p className="text-white/70 text-sm">Select how you feel</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-3">🎧</div>
            <h3 className="text-white font-semibold mb-2">Curated</h3>
            <p className="text-white/70 text-sm">Handpicked playlists</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-3">🎵</div>
            <h3 className="text-white font-semibold mb-2">Spotify</h3>
            <p className="text-white/70 text-sm">Premium quality</p>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full max-w-md text-center animate-fadeIn animation-delay-600">
          <p className="text-white/90 mb-6 text-lg font-medium">
            Ready to find your perfect soundtrack?
          </p>

          <button
            onClick={handleGetStarted}
            className="group w-full h-16 rounded-2xl bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden"
            aria-label="Get started with Spotify"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-2xl">🎵</span>
              Get Started
            </span>
          </button>

          <p className="text-white/60 text-sm mt-4">
            Requires Spotify Premium account
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;