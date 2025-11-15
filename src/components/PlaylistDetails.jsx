import React from "react";
import { useParams } from "react-router-dom";
import { usePlaylistTracks } from "../hooks/usePlaylistTracks";
import { usePlayback } from "../contexts/PlaybackContext";

function PlaylistDetail() {
  // <-- Assuming the function name should be PlaylistDetail
  // 1. Get the playlist ID from the URL path
  const { id: playlistId } = useParams(); // 2. Use the hook to fetch the track data
  const { tracks, loading, error } = usePlaylistTracks(playlistId);

  // <-- 3. Get the playTrack function from the Playback Context
  const { playTrack } = usePlayback();

  if (loading) {
    return <div className="p-8 text-center">Loading playlist tracks...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-purple-500">Error: {error}</div>
    );
  }
  return (
    <div className="p-8 bg-gray-900 min-h-screen mb-20">
      {" "}
      
      <h1 className="text-3xl text-white mb-6">Playlist: {playlistId}</h1>{" "}
      <p className="text-gray-400">Found {tracks.length} tracks.</p>{" "}
      {/* 3. Display the Track List */}{" "}
      <div className="mt-8">
        {" "}
        {tracks.map((track, index) => (
          <div
            key={track.id || index}
            className="flex justify-between items-center p-3 border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors"
            // <-- 4. Call playTrack when the track row is clicked
            onClick={() => playTrack(track.uri)}
          >
              <span className="text-white w-10">{index + 1}</span>
            {" "}
            <div className="grow">
              {" "}
              <p className="text-white font-medium">{track.title}</p>
              {" "}
              <p className="text-sm text-gray-500">
                {track.artist} - {track.album}
              </p>
              {" "}
            </div>
            {/* Convert duration from ms to minutes:seconds */}
            {" "}
            <span className="text-gray-400">
              {(track.duration / 60000).toFixed(2).replace(".", ":")}
            </span>
            {" "}
          </div>
        ))}
        {" "}
      </div>
      {" "}
    </div>
  );
}

export default PlaylistDetail;
