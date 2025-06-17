import React from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return;

  const mainMovie = movies[5];

  const { title, logoUrl, overview, id } = mainMovie;

  return (
    <div className="overflow-hidden">
      <VideoBackground movieId={id} />
      <VideoTitle 
        movieId={id} 
        title={logoUrl?.title || title} 
        logoUrl={logoUrl} 
        overview={overview} 
      />
    </div>
  );
};

export default MainContainer;
