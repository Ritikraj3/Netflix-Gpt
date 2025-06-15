import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addTopRatedTvSeries } from "../utils/TvSeriesSlice";

const useTopRatedTvSeries = () => {
  const dispatch = useDispatch();

  const topRatedTvSeries = useSelector(
    (store) => store.TvSeries.topRatedTvSeries
  );

  //todo Fetch Data from TMDB API and update store

  const getTopRatedTvSeries = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/tv/top_rated?page=1",
      API_OPTIONS
    );
    const json = await data.json();

    dispatch(addTopRatedTvSeries(json.results));
  };

  useEffect(() => {
    !topRatedTvSeries && getTopRatedTvSeries();
  }, []);
};

export default useTopRatedTvSeries;
