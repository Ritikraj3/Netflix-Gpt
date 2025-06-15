import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addNowPlayingMovies } from "../utils/moviesSlice";

const useNowPlayingMovies = () => {
  
  const dispatch = useDispatch();

  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

  const getNowPlayingMovies = async () => {
    try {
      const allMovies = [];

      
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
          API_OPTIONS
        );
        const json = await res.json();
        allMovies.push(...json.results);
        
      dispatch(addNowPlayingMovies(allMovies));
    } catch (error) {
      console.error("Failed to fetch now playing movies:", error);
    }
  };

  useEffect(() => {
   !nowPlayingMovies && getNowPlayingMovies();
  }, []);
};

export default useNowPlayingMovies;
