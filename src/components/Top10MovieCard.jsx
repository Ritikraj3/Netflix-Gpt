import React from "react";
import { IMG_CDN_URL } from "../utils/constant";

const Top10MovieCard = ({ posterPath, index }) => {
  return (
    <div className={`relative w-32 md:w-40  flex-shrink-0 ${
    index === 0 ? "ml-10 md:ml-24" : ""
  }`}>
      {/* Big Ranking Number */}
      <h1
        className="absolute -left-8 md:-left-28 bottom-0 text-[90px] md:text-[220px] 
                   font-extrabold text-white opacity-20 z-0 leading-none tracking-tight 
                   drop-shadow-md pointer-events-none select-none"
      >
        {index + 1}
      </h1>

      {/* Movie Poster */}
      <img
        src={IMG_CDN_URL + posterPath}
        alt="Top Movie Poster"
        className="relative z-10 rounded-md hover:scale-105 transition-transform duration-300 shadow-lg"
      />
    </div>
  );
};

export default Top10MovieCard;
