import { useSelector } from "react-redux"; 
import MovieList from "./MovieList";
import Top10Movies from "./Top10Movies";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const TvSeries = useSelector((store) => store.TvSeries);

  return (
    <div className="bg-[#141414]">
      <div className="md:-mt-42 relative z-30">
        <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
        <Top10Movies title={"Trending Movies"} movies={movies.trendingMovies} />
        <MovieList title={"Upcoming Movies"} movies={movies.upcomingMovies} />
        <MovieList title={"Popular Movies"} movies={movies.popularMovies} />
        <MovieList title={"Top Rated Movies"} movies={movies.topRatedMovies} />
        <MovieList title={"Top Rated Tv Series"} movies={TvSeries.topRatedTvSeries} />
        <MovieList title={"Trending Tv Series"} movies={TvSeries.trendingTvSeries} />
      </div>
    </div>
  );
};

export default SecondaryContainer;
