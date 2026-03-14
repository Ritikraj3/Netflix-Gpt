import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addBollywoodTrending } from "../utils/moviesSlice";

const useBollywoodTrending = () => {
  const dispatch = useDispatch();
  const bollywoodTrending = useSelector((store) => store.movies.bollywoodTrending);

  const fetchBollywoodTrending = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc&region=IN&page=1`,
        API_OPTIONS
      );
      const json = await res.json();
      dispatch(addBollywoodTrending(json.results));
    } catch (error) {
      console.error("Failed to fetch Bollywood trending:", error);
    }
  };

  useEffect(() => {
    !bollywoodTrending && fetchBollywoodTrending();
  }, []);
};

export default useBollywoodTrending;
