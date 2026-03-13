import { createSlice } from "@reduxjs/toolkit";

const TvSeriesSlice = createSlice ({
    name: "TvSeries",
    initialState: {
        topRatedTvSeries: null,
        trendingTvSeries: null,
        anime: null,
        kDrama: null,
    },
    reducers: {
        addTopRatedTvSeries: (state, action) => {
            state.topRatedTvSeries = action.payload;
        },
        addTrendingTvSeries: (state, action) => {
            state.trendingTvSeries = action.payload;
        },
        addAnime: (state, action) => {
            state.anime = action.payload;
        },
        addKDrama: (state, action) => {
            state.kDrama = action.payload;
        },
    },
})

export const { addTopRatedTvSeries, addTrendingTvSeries, addAnime, addKDrama } = TvSeriesSlice.actions;
export default TvSeriesSlice.reducer