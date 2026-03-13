import { createSlice } from "@reduxjs/toolkit";

const trailerModalSlice = createSlice({
  name: "trailerModal",
  initialState: {
    isOpen: false,
    trailerKey: null,
    movieTitle: null,
  },
  reducers: {
    openTrailerModal: (state, action) => {
      state.isOpen = true;
      state.trailerKey = action.payload.trailerKey;
      state.movieTitle = action.payload.movieTitle;
    },
    closeTrailerModal: (state) => {
      state.isOpen = false;
      state.trailerKey = null;
      state.movieTitle = null;
    },
  },
});

export const { openTrailerModal, closeTrailerModal } = trailerModalSlice.actions;
export default trailerModalSlice.reducer;
