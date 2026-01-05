import React, { useEffect, useState } from "react";
import Logo from "../assets/logo2.png"

const WelcomeScreen = () => {
  const [loggedInState, setLoggedInState] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Simulate checking login status
    const userIsLoggedIn = Math.random() > 0.5; // Random for demo
    setLoggedInState(userIsLoggedIn);

    if (userIsLoggedIn) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        console.log("Redirecting to /moods-select");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleGetStarted = () => {
    if (loggedInState) {
      console.log("Navigate to /moods-select");
    } else {
      console.log("Navigate to /spotify-login");
    }
  };

  // Loading state
  if (loggedInState === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div 
        className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-56 h-56 sm:w-80 sm:h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl w-full">
        
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="mb-6">
            <div className="inline-block bg-purple-500/20 p-4 sm:p-5 rounded-3xl border border-purple-500/30">
              <span className="text-5xl sm:text-6xl">🎵</span>
            </div>
          </div>
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
            {loggedInState ? "Welcome Back! 👋" : "MOODMATCH"}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto leading-relaxed px-4">
            {loggedInState
              ? "Ready to discover more music?"
              : "Discover music perfectly tailored to your mood"}
          </p>
        </header>

        {/* Music Art Image */}
        <div className="mb-8 sm:mb-12 w-full max-w-sm px-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-30"></div>
            <img
              src={Logo}
              alt="MoodMatch Music Art"
              className="relative w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Features - Only show if NOT logged in */}
        {!loggedInState && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 w-full max-w-3xl px-4">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">😊</div>
              <h3 className="text-white font-bold text-lg mb-2">Mood-Based</h3>
              <p className="text-white/60 text-sm leading-relaxed">Select how you feel</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🎧</div>
              <h3 className="text-white font-bold text-lg mb-2">Curated</h3>
              <p className="text-white/60 text-sm leading-relaxed">Handpicked playlists</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🎵</div>
              <h3 className="text-white font-bold text-lg mb-2">Spotify</h3>
              <p className="text-white/60 text-sm leading-relaxed">Premium quality</p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="w-full max-w-md text-center px-4">
          {redirecting ? (
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-3 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
              <p className="text-white/90 text-base sm:text-lg font-medium">
                Redirecting you now...
              </p>
            </div>
          ) : (
            <p className="text-white/80 mb-6 text-base sm:text-lg font-medium">
              {loggedInState
                ? "Continue your music journey"
                : "Ready to find your perfect soundtrack?"}
            </p>
          )}
          
          <button
            onClick={handleGetStarted}
            disabled={redirecting}
            className="group w-full py-4 sm:py-5 px-6 rounded-2xl bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white text-lg sm:text-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-purple-500/60 relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label={loggedInState ? "Browse Music" : "Get started with Spotify"}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">{loggedInState ? "🎶" : "🎵"}</span>
              <span>{loggedInState ? "Browse Music" : "Get Started"}</span>
            </span>
          </button>
          
          {!loggedInState && (
            <p className="text-white/50 text-xs sm:text-sm mt-4 leading-relaxed">
              Requires Spotify Premium account
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;