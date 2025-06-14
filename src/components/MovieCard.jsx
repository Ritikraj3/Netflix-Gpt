import React from 'react';
import { IMG_CDN_URL } from '../utils/constant';

const MovieCard = ({ posterPath }) => {
  return (
    <div className="w-32 md:w-40 h-48 md:h-60 transform transition-transform duration-300 hover:scale-110">
      <img
        className="rounded-md w-full h-full object-cover"
        src={IMG_CDN_URL + posterPath}
        alt="Movie Poster"
        loading="lazy"
      />
    </div>
  );
};

export default MovieCard;
