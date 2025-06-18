import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addTrailerVideo } from "../utils/moviesSlice";

const useMovieTrailer = ({movieId}) => {

      const dispatch = useDispatch();

      const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  const getMoviesVideos = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS
    );
    const json = await data.json();

    const filteredTrailers = json.results.filter(
      (video) => video.type === "Trailer"
    );
    const trailer = filteredTrailers.length
      ? filteredTrailers[1]
      : json.results[1];

    dispatch(addTrailerVideo(trailer))
  };

  useEffect(() => {
  !trailerVideo &&  getMoviesVideos();
  }, []);
    
}

export default useMovieTrailer