import React, { use } from "react";
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
import GptSearch from "./GptSearch";
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

  return (
    <div>
      <Header />
      {showGptSearch ? (
        <GptSearch />
      ) : (
        <>
          <MainContainer /> <SecondaryContainer />
        </>
      )}

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
