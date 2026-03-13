import { API_OPTIONS } from "../utils/constant";

const useTmdbMovieSearch = () => {
  const searchMovieTMDB = async (movie) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&page=1`,
      API_OPTIONS
    );
    const json = await res.json();
    const results = json.results || [];

    // Prefer exact title match, otherwise fall back to first result
    const exact = results.find(
      (m) => m.title?.toLowerCase() === movie.toLowerCase()
    );
    return exact || results[0] || null;
  };

  const getTmdbResults = async (movies) => {
    const results = await Promise.all(movies.map(searchMovieTMDB));
    return results.filter(Boolean);
  };

  return { getTmdbResults };
};

export default useTmdbMovieSearch;
