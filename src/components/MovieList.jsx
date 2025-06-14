import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  return (
    <div className="px-4 md:px-6 ">
      <h1 className="text-white text-xl md:text-2xl md:mt-6 font-semibold pt-6 md:pt-3 py-3 md:py-4">
        {title}
      </h1>
      <div className="flex overflow-x-scroll overflow-y-hidden scrollbar-hide">
        <div className="flex space-x-6 ">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} posterPath={movie.poster_path} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
