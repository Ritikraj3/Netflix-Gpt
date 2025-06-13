import React from "react";
import Top10MovieCard from "./Top10MovieCard";

const Top10Movies = ({ movies , title }) => {
  return (
    <div className="px-4 md:px-6">
      <h1 className="text-white text-xl md:text-2xl md:mt-6 font-semibold pt-6 md:pt-3 py-3 md:py-4">{title}</h1>
      <div className="flex overflow-x-auto overflow-y-hidden gap-10 md:gap-32 scrollbar-hide">
        {movies?.slice(0, 10).map((movie, index) => (
          <Top10MovieCard
            key={movie.id}
            posterPath={movie.poster_path}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Top10Movies;
