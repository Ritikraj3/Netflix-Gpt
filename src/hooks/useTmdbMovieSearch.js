import { API_OPTIONS } from "../utils/constant";

const useTmdbMovieSearch = () => {
  const searchMovieTMDB = async (movie) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&page=1`,
      API_OPTIONS
    );
    const json = await res.json();
    return json.results;
  };

  const getTmdbResults = async (movies) => {
    const results = await Promise.all(movies.map(searchMovieTMDB));
    return results;
  };

  return { getTmdbResults };
};

export default useTmdbMovieSearch;
