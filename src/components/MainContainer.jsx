import { useMemo, useRef } from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const nowPlaying = useSelector((store) => store.movies?.nowPlayingMovies);
  const popular = useSelector((store) => store.movies?.popularMovies);
  const trending = useSelector((store) => store.movies?.trendingMovies);
  const topRated = useSelector((store) => store.movies?.topRatedMovies);
  const upcoming = useSelector((store) => store.movies?.upcomingMovies);

  // Lock the chosen movie once — never re-pick as more lists arrive
  const lockedMovie = useRef(null);

  const mainMovie = useMemo(() => {
    if (lockedMovie.current) return lockedMovie.current;

    const allMovies = [
      ...(nowPlaying || []),
      ...(popular || []),
      ...(trending || []),
      ...(topRated || []),
      ...(upcoming || []),
    ].filter((m) => m?.id && m?.overview && m?.title);

    if (!allMovies.length) return null;
    lockedMovie.current = allMovies[Math.floor(Math.random() * allMovies.length)];
    return lockedMovie.current;
  }, [!!nowPlaying, !!popular, !!trending, !!topRated, !!upcoming]);

  if (!mainMovie) return null;

  const { title, logoUrl, overview, id, backdrop_path } = mainMovie;

  return (
    <div className="relative overflow-hidden">
      <VideoBackground movieId={id} backdropPath={backdrop_path} />
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
