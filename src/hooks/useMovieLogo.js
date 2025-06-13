// hooks/useMovieLogo.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addMovieLogo } from "../utils/moviesSlice";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/original";

const useMovieLogo = ({ movieId }) => {
  const dispatch = useDispatch();

  const fetchMovieLogo = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images?include_image_language=en,null`,
        API_OPTIONS
      );
      const data = await res.json();

      const logo = data.logos?.[0];
      const logoUrl = logo ? TMDB_IMAGE_URL + logo.file_path : null;

      dispatch(addMovieLogo(logoUrl));
    } catch (err) {
      console.error("Error fetching movie logo:", err);
    }
  };

  useEffect(() => {
    if (movieId) fetchMovieLogo();
  }, [movieId]);
};

export default useMovieLogo;
