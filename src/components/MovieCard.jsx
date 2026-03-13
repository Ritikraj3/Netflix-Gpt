import React from 'react';
import { IMG_CDN_URL } from '../utils/constant';
import useWatchlist from '../hooks/useWatchlist';

const MovieCard = ({ posterPath, movie }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  if (!posterPath) return null;

  const saved = movie ? isInWatchlist(movie.id) : false;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (movie) toggleWatchlist(movie);
  };

  return (
    <div className="relative w-32 md:w-40 h-48 md:h-60 group transform transition-transform duration-300 hover:scale-110">
      <img
        className="rounded-md w-full h-full object-cover"
        src={IMG_CDN_URL + posterPath}
        alt="Movie Poster"
        loading="eager"
        width="160"
        height="240"
      />
      {movie && (
        <button
          onClick={handleToggle}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 rounded-full p-1.5 hover:bg-black/80"
          title={saved ? "Remove from My List" : "Add to My List"}
        >
          {saved ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default MovieCard;
