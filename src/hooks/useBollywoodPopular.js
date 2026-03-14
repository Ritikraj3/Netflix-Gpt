import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addBollywoodPopular } from "../utils/moviesSlice";

const useBollywoodPopular = () => {
  const dispatch = useDispatch();
  const bollywoodPopular = useSelector((store) => store.movies.bollywoodPopular);

  const fetchBollywoodPopular = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=hi-IN&region=IN&page=1`,
        API_OPTIONS
      );
      const json = await res.json();
      dispatch(addBollywoodPopular(json.results));
    } catch (error) {
      console.error("Failed to fetch Bollywood popular:", error);
    }
  };

  useEffect(() => {
    !bollywoodPopular && fetchBollywoodPopular();
  }, []);
};

export default useBollywoodPopular;
