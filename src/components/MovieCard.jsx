import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IMG_CDN_URL, API_OPTIONS } from "../utils/constant";
import { openTrailerModal } from "../utils/trailerModalSlice";
import useWatchlist from "../hooks/useWatchlist";
import { FaPlay, FaSpinner } from "react-icons/fa";

const MovieCard = ({ posterPath, movie }) => {
  const dispatch = useDispatch();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  if (!posterPath) return null;

  const saved = movie ? isInWatchlist(movie.id) : false;

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    if (movie) toggleWatchlist(movie);
  };

  const handleWatchTrailer = async (e) => {
    e.stopPropagation();
    if (!movie) return;
    setLoadingTrailer(true);
    try {
      const mediaType = movie.title ? "movie" : "tv";
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movie.id}/videos?language=en-US`,
        API_OPTIONS
      );
      const json = await res.json();
      const trailer =
        json.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        json.results?.[0];

      if (trailer?.key) {
        dispatch(
          openTrailerModal({
            trailerKey: trailer.key,
            movieTitle: movie.title || movie.name,
          })
        );
      }
    } catch (err) {
      console.error("Failed to fetch trailer:", err);
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <div className="relative w-32 md:w-40 h-48 md:h-60 group flex-shrink-0">
      <img
        className="rounded-md w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        src={IMG_CDN_URL + posterPath}
        alt="Movie Poster"
        loading="eager"
        width="160"
        height="240"
      />

      {/* Hover overlay */}
      {movie && (
        <div className="absolute inset-0 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 flex flex-col items-center justify-end pb-3 gap-2">
          {/* Watch Trailer button */}
          <button
            onClick={handleWatchTrailer}
            className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors w-[80%] justify-center"
          >
            {loadingTrailer ? (
              <FaSpinner className="animate-spin w-3 h-3" />
            ) : (
              <FaPlay className="w-3 h-3" />
            )}
            Trailer
          </button>

          {/* Bookmark button */}
          <button
            onClick={handleToggleWatchlist}
            className="flex items-center gap-1.5 bg-white/20 border border-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors w-[80%] justify-center"
          >
            {saved ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
                </svg>
                My List
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
