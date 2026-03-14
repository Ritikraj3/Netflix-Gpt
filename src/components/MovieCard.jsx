import { useState } from "react";
import { useDispatch } from "react-redux";
import { IMG_CDN_URL, API_OPTIONS } from "../utils/constant";
import { openTrailerModal } from "../utils/trailerModalSlice";
import useWatchlist from "../hooks/useWatchlist";
import { FaPlay, FaSpinner } from "react-icons/fa";

const MovieCard = ({ posterPath, movie }) => {
  const dispatch = useDispatch();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [tapped, setTapped] = useState(false);

  if (!posterPath) return null;

  const saved = movie ? isInWatchlist(movie.id) : false;

  const handleCardClick = () => {
    setTapped((prev) => !prev);
  };

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
    <div
      className="relative w-28 sm:w-32 md:w-40 h-44 sm:h-48 md:h-60 group flex-shrink-0 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        className={`rounded-md w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${tapped ? "scale-105" : ""}`}
        src={IMG_CDN_URL + posterPath}
        alt="Movie Poster"
        loading="eager"
        width="160"
        height="240"
      />

      {/* Overlay — visible on hover (desktop) or tap (mobile) */}
      {movie && (
        <div
          className={`absolute inset-0 rounded-md bg-black/50 transition-all duration-300 flex flex-col items-center justify-end pb-3 gap-2
            md:opacity-0 md:group-hover:opacity-100 md:group-hover:scale-110
            ${tapped ? "opacity-100 scale-105" : "opacity-0"}`}
        >
          {/* Movie title */}
          <p className="text-white text-[10px] font-semibold text-center w-[80%] line-clamp-2 leading-tight drop-shadow-md">
            {movie.title || movie.name}
          </p>

          {/* Play button */}
          <button
            onClick={handleWatchTrailer}
            className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors w-[80%] justify-center"
          >
            {loadingTrailer ? (
              <FaSpinner className="animate-spin w-3 h-3" />
            ) : (
              <FaPlay className="w-3 h-3" />
            )}
            Play
          </button>

          {/* My List button */}
          <button
            onClick={handleToggleWatchlist}
            className="flex items-center gap-1.5 bg-white/20 border border-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 active:bg-white/40 transition-colors w-[80%] justify-center"
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
