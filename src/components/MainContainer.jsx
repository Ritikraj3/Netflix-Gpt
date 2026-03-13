import React, { useMemo } from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const nowPlaying = useSelector((store) => store.movies?.nowPlayingMovies);
  const popular = useSelector((store) => store.movies?.popularMovies);
  const trending = useSelector((store) => store.movies?.trendingMovies);
  const topRated = useSelector((store) => store.movies?.topRatedMovies);
  const upcoming = useSelector((store) => store.movies?.upcomingMovies);

  const mainMovie = useMemo(() => {
    const allMovies = [
      ...(nowPlaying || []),
      ...(popular || []),
      ...(trending || []),
      ...(topRated || []),
      ...(upcoming || []),
    ].filter((m) => m?.id && m?.overview && m?.title);

    if (!allMovies.length) return null;
    return allMovies[Math.floor(Math.random() * allMovies.length)];
  }, [!!nowPlaying, !!popular, !!trending, !!topRated, !!upcoming]);

  if (!mainMovie) return null;

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
