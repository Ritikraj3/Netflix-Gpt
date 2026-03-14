import React from "react";
import Header from "./Header";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import SecondaryContainer from "./SecondaryContainer";
import MainContainer from "./MainContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useTopRatedTvSeries from "../hooks/useTopRatedTvSeries";
import useTrendingTvSeries from "../hooks/useTrendingTvSeries";
import useTrendingMovies from "../hooks/useTrendingMovies";
import useAnime from "../hooks/useAnime";
import useKDrama from "../hooks/useKDrama";
import useBollywoodTrending from "../hooks/useBollywoodTrending";
import useBollywoodPopular from "../hooks/useBollywoodPopular";
import useBollywoodTopRated from "../hooks/useBollywoodTopRated";
import useWatchlist from "../hooks/useWatchlist";
import GptSearch from "./GptSearch";
import TrailerModal from "./TrailerModal";
import MovieChatBot from "./MovieChatBot";
import { useSelector } from "react-redux";

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  useNowPlayingMovies();
  usePopularMovies();
  useUpcomingMovies();
  useTopRatedMovies();
  useTopRatedTvSeries();
  useTrendingTvSeries();
  useTrendingMovies();
  useAnime();
  useKDrama();
  useBollywoodTrending();
  useBollywoodPopular();
  useBollywoodTopRated();

  const uid = useSelector((store) => store.user?.uid);
  const { fetchWatchlist } = useWatchlist();
  React.useEffect(() => { if (uid) fetchWatchlist(); }, [uid]);

  return (
    <div>
      <TrailerModal />
      <Header />
      {showGptSearch ? (
        <GptSearch />
      ) : (
        <>
          <MainContainer /> <SecondaryContainer />
        </>
      )}
      <MovieChatBot />

      {/* 
        MainContainer
          -videoContainer
          -VideoTitle
        SecondaryContainer
          -MovieList * n
          -Cards * n
       */}
    </div>
  );
};

export default Browse;
