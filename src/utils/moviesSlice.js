// utils/moviesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: null,
    trailerVideo: null,
    movieLogo: null,
    popularMovies: null,
    trendingMovies: null,
    topRatedMovies: null,
    upcomingMovies: null, 
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = action.payload;
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = action.payload; 
    },
    addUpcomingMovies: (state, action) => {
      state.upcomingMovies = action.payload; 
    },
    addTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload; 
    },
    addTrendingMovies: (state, action) => {
      state.trendingMovies = action.payload; 
    },
    addTrailerVideo: (state, action) => {
      state.trailerVideo = action.payload;
    },
    addMovieLogo: (state, action) => {
      state.movieLogo = action.payload; 
    },
  },
});

export const {
  addNowPlayingMovies,
  addTrailerVideo,
  addMovieLogo,
  addPopularMovies,
  addUpcomingMovies,
  addTopRatedMovies,
  addTrendingMovies, // <-- export it
} = moviesSlice.actions;

export default moviesSlice.reducer;
