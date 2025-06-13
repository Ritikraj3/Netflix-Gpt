import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addTrendingMovies } from "../utils/moviesSlice";

const useTrendingMovies = () => {
  const dispatch = useDispatch();
  
  //todo Fetch Data from TMDB API and update store

      const getTrendingMovies = async () => {
        const data = await fetch(
          "https://api.themoviedb.org/3/trending/movie/day",
          API_OPTIONS
        );
        const json = await data.json();

        dispatch(addTrendingMovies(json.results));
      };
    
      useEffect(() => {
        getTrendingMovies();
      }, []);

}

export default useTrendingMovies