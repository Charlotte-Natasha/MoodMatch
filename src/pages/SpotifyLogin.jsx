import React from "react";

const SpotifyLoginPage = () => {
  const handleSpotifyLogin = () => {
    // Simulated login for demo purposes
    console.log("Redirecting to Spotify login...");
  };

  const SpotifyIcon = (props) => (
    <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );

  const CheckIcon = (props) => (
    <svg className={props.className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const features = [
    {
      title: "Full Music Library",
      description: "Access millions of songs and your saved playlists."
    },
    {
      title: "Mood-Based Discovery",
      description: "Get new, unique playlists based on your listening habits."
    },
    {
      title: "Seamless Integration",
      description: "Control music right from our app via Spotify Connect."
    }
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-purple-500/20 rounded-full blur-3xl opacity-30" style={{ animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/10 rounded-full blur-3xl opacity-20" style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}></div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main card */}
        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          
          {/* Header section */}
          <div className="text-center mb-8">
            <div className="mb-5 flex justify-center">
              <div className="bg-green-500/20 p-4 rounded-2xl border border-green-500/30">
                <SpotifyIcon className="w-12 h-12 sm:w-14 sm:h-14 text-green-400" />
              </div>
            </div>
            <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
              Unlock Your Music Discovery
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
              Connect your Spotify account to access personalized music insights.
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-white group">
                <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-green-500/30 rounded-full flex items-center justify-center mt-0.5 border border-green-500/40 group-hover:bg-green-500/40 transition-colors duration-300">
                  <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg sm:text-xl mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Login button */}
          <button
            onClick={handleSpotifyLogin}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-extrabold py-3.5 sm:py-4 px-6 rounded-full text-lg sm:text-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-2xl hover:shadow-green-500/60 flex items-center justify-center gap-3 group"
          >
            <SpotifyIcon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
            Log in to Spotify
          </button>

          {/* Premium info banner */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center mt-6 hover:bg-white/10 transition-colors duration-300">
            <p className="text-white/60 text-sm leading-relaxed">
              <span className="font-bold text-green-400">Spotify Premium</span> is recommended for full music playback control.
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-white/40 text-center text-xs sm:text-sm mt-6 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SpotifyLoginPage;