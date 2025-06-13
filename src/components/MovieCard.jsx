import React from 'react';
import { IMG_CDN_URL } from '../utils/constant';

const MovieCard = ({ posterPath }) => {
  return (
    <div className="w-32 md:w-40 transform transition-transform duration-300 hover:scale-110">
      <img
        className="rounded-md"
        src={IMG_CDN_URL + posterPath}
        alt="Movie Poster"
      />
    </div>
  );
};

export default MovieCard;
