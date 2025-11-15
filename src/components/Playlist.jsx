import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // When clicked, navigate to the specific playlist detail page
        navigate(`/playlist/${playlist.id}`); 
    };

    return (
        <div 
            onClick={handleClick}
            className="group cursor-pointer p-4 rounded-lg transition-all duration-300 hover:bg-black/20"
        >
            <div className="relative w-full aspect-square shadow-xl overflow-hidden rounded-md">
                <img 
                    src={playlist.imageUrl} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover"
                />
                {/* Play Button - appears on hover */}
                <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-green-500 rounded-full shadow-lg">
                    {/*  */}
                </button>
            </div>
            <h3 className="mt-3 font-semibold text-white truncate">{playlist.name}</h3>
            <p className="text-sm text-gray-400 truncate">by {playlist.owner}</p>
        </div>
    );
};

export default PlaylistCard;