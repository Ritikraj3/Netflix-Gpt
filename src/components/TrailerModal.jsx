import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeTrailerModal } from "../utils/trailerModalSlice";
import { FaTimes } from "react-icons/fa";

const TrailerModal = () => {
  const dispatch = useDispatch();
  const { isOpen, trailerKey, movieTitle } = useSelector(
    (store) => store.trailerModal
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") dispatch(closeTrailerModal());
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !trailerKey) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={() => dispatch(closeTrailerModal())}
    >
      <div
        className="relative w-full max-w-4xl mx-4 aspect-video rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => dispatch(closeTrailerModal())}
          className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black text-white rounded-full p-2 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Title */}
        {movieTitle && (
          <div className="absolute top-3 left-3 z-10 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {movieTitle}
          </div>
        )}

        {/* YouTube Embed */}
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&rel=0&modestbranding=1`}
          title={movieTitle || "Trailer"}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerModal;
