import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addKDrama } from "../utils/TvSeriesSlice";

const useKDrama = () => {
  const dispatch = useDispatch();
  const kDrama = useSelector((store) => store.TvSeries.kDrama);

  const getKDrama = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?with_origin_country=KR&with_genres=18&sort_by=popularity.desc&page=1`,
        API_OPTIONS
      );
      const json = await res.json();
      dispatch(addKDrama(json.results));
    } catch (error) {
      console.error("Failed to fetch K-Dramas:", error);
    }
  };

  useEffect(() => {
    !kDrama && getKDrama();
  }, []);
};

export default useKDrama;
