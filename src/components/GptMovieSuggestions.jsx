import React from 'react';
import { useSelector } from 'react-redux';
import MovieList from './MovieList';
import GptLogo from '../assets/chatgpt-4.svg';

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);

  if (!movieResults) {
    return (
      <div className="flex justify-center items-center h-[70vh] ">
      <img
        src={GptLogo}
        alt="Loading..."
        className="h-20 w-20 animate-spin [animation-duration:2.5s]"
      />
    </div>
    );
  }

  return (
    <div>
      {movieNames.map((movie, index) => (
        <MovieList key={index} title={movie} movies={movieResults[index]} />
      ))}
    </div>
  );
};

export default GptMovieSuggestions;
