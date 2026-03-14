import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addBollywoodTopRated } from "../utils/moviesSlice";

const useBollywoodTopRated = () => {
  const dispatch = useDispatch();
  const bollywoodTopRated = useSelector((store) => store.movies.bollywoodTopRated);

  const fetchBollywoodTopRated = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=200&region=IN&page=1`,
        API_OPTIONS
      );
      const json = await res.json();
      dispatch(addBollywoodTopRated(json.results));
    } catch (error) {
      console.error("Failed to fetch Bollywood top rated:", error);
    }
  };

  useEffect(() => {
    !bollywoodTopRated && fetchBollywoodTopRated();
  }, []);
};

export default useBollywoodTopRated;
