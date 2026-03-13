import { createSlice } from "@reduxjs/toolkit";

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items: [],
  },
  reducers: {
    setWatchlist: (state, action) => {
      state.items = action.payload;
    },
    addToWatchlist: (state, action) => {
      const exists = state.items.find((m) => m.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
  },
});

export const { setWatchlist, addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
