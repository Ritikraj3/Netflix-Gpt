import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import {  addPopularMovies } from "../utils/moviesSlice";

const usePopularMovies = () => {
  const dispatch = useDispatch();

  const popularMovies = useSelector((store) => store.movies.popularMovies); 
  
  //todo Fetch Data from TMDB API and update store

      const getPopularMovies = async () => {
        const data = await fetch(
          "https://api.themoviedb.org/3/movie/popular?page=1",
          API_OPTIONS
        );
        const json = await data.json();

        dispatch(addPopularMovies(json.results));
      };
    
      useEffect(() => {
      !popularMovies &&  getPopularMovies();
      }, []);

}

export default usePopularMovies