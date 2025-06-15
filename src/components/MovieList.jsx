import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  const isLoading = !movies || movies.length === 0;

  return (
    <div className="px-4 md:px-6 min-h-[260px]"> {/* Prevent CLS */}
      <h1 className="text-white text-xl md:text-2xl md:mt-6 font-semibold  py-3 md:py-4">
        {title}
      </h1>
      <div className="flex overflow-x-scroll overflow-y-hidden scrollbar-hide">
        <div className="flex space-x-6 pb-5">
          {isLoading
            ? Array(6).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-32 md:w-40 h-48 md:h-60 bg-neutral-800 rounded-md animate-pulse"
                />
              ))
            : movies.map((movie) => (
                <MovieCard key={movie.id} posterPath={movie.poster_path} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
