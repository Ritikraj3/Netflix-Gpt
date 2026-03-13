import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addAnime } from "../utils/TvSeriesSlice";

const useAnime = () => {
  const dispatch = useDispatch();
  const anime = useSelector((store) => store.TvSeries.anime);

  const getAnime = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=1`,
        API_OPTIONS
      );
      const json = await res.json();
      dispatch(addAnime(json.results));
    } catch (error) {
      console.error("Failed to fetch anime:", error);
    }
  };

  useEffect(() => {
    !anime && getAnime();
  }, []);
};

export default useAnime;
