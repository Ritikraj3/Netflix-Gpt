import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addTrendingTvSeries } from "../utils/TvSeriesSlice";

const useTrendingTvSeries = () => {
  const dispatch = useDispatch();
  
  //todo Fetch Data from TMDB API and update store

      const getTrendingTvSeries = async () => {
        const data = await fetch(
          "https://api.themoviedb.org/3/trending/tv/day",
          API_OPTIONS
        );
        const json = await data.json();

        dispatch(addTrendingTvSeries(json.results));
      };
    
      useEffect(() => {
        getTrendingTvSeries();
      }, []);

}

export default useTrendingTvSeries