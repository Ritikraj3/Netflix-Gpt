import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import Top10Movies from "./Top10Movies";
import useInfiniteRows from "../hooks/useInfiniteRows";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const TvSeries = useSelector((store) => store.TvSeries);
  const watchlist = useSelector((store) => store.watchlist.items);

  const { extraRows, loadMore, loading, hasMore } = useInfiniteRows();
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="bg-[#141414]">
      <div className="md:-mt-42 relative z-30">
        {/* ── Fixed rows (existing) ── */}
        {watchlist.length > 0 && (
          <MovieList title={"My List"} movies={watchlist} />
        )}
        <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
        <Top10Movies title={"Trending Movies"} movies={movies.trendingMovies} />
        <Top10Movies title={"Trending TV Series"} movies={TvSeries.trendingTvSeries} />
        <MovieList title={"Upcoming Movies"} movies={movies.upcomingMovies} />
        <MovieList title={"Popular Movies"} movies={movies.popularMovies} />
        <MovieList title={"Top Rated Movies"} movies={movies.topRatedMovies} />
        <MovieList title={"Bollywood Trending"} movies={movies.bollywoodTrending} />
        <MovieList title={"Bollywood Now Playing"} movies={movies.bollywoodPopular} />
        <MovieList title={"Bollywood Top Rated"} movies={movies.bollywoodTopRated} />
        <MovieList title={"Top Rated Tv Series"} movies={TvSeries.topRatedTvSeries} />
        <MovieList title={"Anime"} movies={TvSeries.anime} />
        <MovieList title={"K-Drama"} movies={TvSeries.kDrama} />

        {/* ── Infinite scroll rows ── */}
        {extraRows.map((row) => (
          <MovieList key={row.title} title={row.title} movies={row.movies} />
        ))}

        {/* Sentinel + loader */}
        <div ref={sentinelRef} className="py-4 flex justify-center">
          {loading && (
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          {!hasMore && !loading && (
            <p className="text-white/20 text-xs pb-4">You've reached the end</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryContainer;
