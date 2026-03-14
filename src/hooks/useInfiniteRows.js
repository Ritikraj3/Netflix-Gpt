import { useState, useCallback } from "react";
import { API_OPTIONS } from "../utils/constant";

const BASE = "https://api.themoviedb.org/3/";
const ROWS_PER_LOAD = 2;

// Full queue — each entry fetched on-demand as user scrolls
const ROW_QUEUE = [
  // ── Movies by genre ───────────────────────────────────────────────────────
  { title: "Action Movies",      url: "discover/movie?with_genres=28&sort_by=popularity.desc" },
  { title: "Comedy Movies",      url: "discover/movie?with_genres=35&sort_by=popularity.desc" },
  { title: "Thriller Movies",    url: "discover/movie?with_genres=53&sort_by=popularity.desc" },
  { title: "Sci-Fi Movies",      url: "discover/movie?with_genres=878&sort_by=popularity.desc" },
  { title: "Horror Movies",      url: "discover/movie?with_genres=27&sort_by=popularity.desc" },
  { title: "Romance Movies",     url: "discover/movie?with_genres=10749&sort_by=popularity.desc" },
  { title: "Animation Movies",   url: "discover/movie?with_genres=16&sort_by=popularity.desc" },
  { title: "Drama Movies",       url: "discover/movie?with_genres=18&sort_by=popularity.desc" },
  { title: "Crime Movies",       url: "discover/movie?with_genres=80&sort_by=popularity.desc" },
  { title: "Adventure Movies",   url: "discover/movie?with_genres=12&sort_by=popularity.desc" },
  { title: "Fantasy Movies",     url: "discover/movie?with_genres=14&sort_by=popularity.desc" },
  { title: "Mystery Movies",     url: "discover/movie?with_genres=9648&sort_by=popularity.desc" },
  { title: "Documentary Movies", url: "discover/movie?with_genres=99&sort_by=popularity.desc" },
  { title: "Family Movies",      url: "discover/movie?with_genres=10751&sort_by=popularity.desc" },
  { title: "History Movies",     url: "discover/movie?with_genres=36&sort_by=popularity.desc" },
  { title: "War Movies",         url: "discover/movie?with_genres=10752&sort_by=popularity.desc" },
  { title: "Western Movies",     url: "discover/movie?with_genres=37&sort_by=popularity.desc" },
  { title: "Music Movies",       url: "discover/movie?with_genres=10402&sort_by=popularity.desc" },

  // ── TV Series by genre ────────────────────────────────────────────────────
  { title: "Popular TV Series",          url: "tv/popular" },
  { title: "Airing Today",               url: "tv/airing_today" },
  { title: "Action & Adventure Series",  url: "discover/tv?with_genres=10759&sort_by=popularity.desc" },
  { title: "Comedy Series",              url: "discover/tv?with_genres=35&sort_by=popularity.desc" },
  { title: "Crime Series",               url: "discover/tv?with_genres=80&sort_by=popularity.desc" },
  { title: "Drama Series",               url: "discover/tv?with_genres=18&sort_by=popularity.desc" },
  { title: "Sci-Fi & Fantasy Series",    url: "discover/tv?with_genres=10765&sort_by=popularity.desc" },
  { title: "Mystery Series",             url: "discover/tv?with_genres=9648&sort_by=popularity.desc" },
  { title: "Animation Series",           url: "discover/tv?with_genres=16&sort_by=popularity.desc" },
  { title: "Reality TV",                 url: "discover/tv?with_genres=10764&sort_by=popularity.desc" },
  { title: "Documentary Series",         url: "discover/tv?with_genres=99&sort_by=popularity.desc" },
  { title: "Kids & Family TV",           url: "discover/tv?with_genres=10762&sort_by=popularity.desc" },
  { title: "Talk Shows",                 url: "discover/tv?with_genres=10767&sort_by=popularity.desc" },

  // ── Indian Regional ───────────────────────────────────────────────────────
  { title: "Tamil Movies",            url: "discover/movie?with_original_language=ta&sort_by=popularity.desc" },
  { title: "Tamil Series",            url: "discover/tv?with_original_language=ta&sort_by=popularity.desc" },
  { title: "Telugu Movies",           url: "discover/movie?with_original_language=te&sort_by=popularity.desc" },
  { title: "Telugu Series",           url: "discover/tv?with_original_language=te&sort_by=popularity.desc" },
  { title: "Malayalam Movies",        url: "discover/movie?with_original_language=ml&sort_by=popularity.desc" },
  { title: "Malayalam Series",        url: "discover/tv?with_original_language=ml&sort_by=popularity.desc" },
  { title: "Kannada Movies",          url: "discover/movie?with_original_language=kn&sort_by=popularity.desc" },
  { title: "Bengali Movies",          url: "discover/movie?with_original_language=bn&sort_by=popularity.desc" },
  { title: "Bengali Series",          url: "discover/tv?with_original_language=bn&sort_by=popularity.desc" },
  { title: "Marathi Movies",          url: "discover/movie?with_original_language=mr&sort_by=popularity.desc" },
  { title: "Punjabi Movies",          url: "discover/movie?with_original_language=pa&sort_by=popularity.desc" },
  { title: "Gujarati Movies",         url: "discover/movie?with_original_language=gu&sort_by=popularity.desc" },

  // ── Other Regional ────────────────────────────────────────────────────────
  { title: "Spanish Movies",   url: "discover/movie?with_original_language=es&sort_by=popularity.desc" },
  { title: "Spanish Series",   url: "discover/tv?with_original_language=es&sort_by=popularity.desc" },
  { title: "Japanese Movies",  url: "discover/movie?with_original_language=ja&sort_by=popularity.desc" },
  { title: "Turkish Series",   url: "discover/tv?with_original_language=tr&sort_by=popularity.desc" },
  { title: "French Movies",    url: "discover/movie?with_original_language=fr&sort_by=popularity.desc" },
];

const useInfiniteRows = () => {
  const [extraRows, setExtraRows] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const hasMore = queueIndex < ROW_QUEUE.length;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const batch = ROW_QUEUE.slice(queueIndex, queueIndex + ROWS_PER_LOAD);

    const results = await Promise.all(
      batch.map(async ({ title, url }) => {
        try {
          const res = await fetch(`${BASE}${url}&language=en-US`, API_OPTIONS);
          const json = await res.json();
          const movies = (json.results || []).filter((m) => m.poster_path);
          return movies.length ? { title, movies } : null;
        } catch {
          return null;
        }
      })
    );

    const valid = results.filter(Boolean);
    if (valid.length) setExtraRows((prev) => [...prev, ...valid]);
    setQueueIndex((prev) => prev + ROWS_PER_LOAD);
    setLoading(false);
  }, [queueIndex, loading, hasMore]);

  return { extraRows, loadMore, loading, hasMore };
};

export default useInfiniteRows;
