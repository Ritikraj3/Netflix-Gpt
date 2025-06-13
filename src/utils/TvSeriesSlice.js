import { createSlice } from "@reduxjs/toolkit";

const TvSeriesSlice = createSlice ({
    name: "TvSeries",
    initialState: {
        topRatedTvSeries: null,
        trendingTvSeries: null
    },
    reducers: {
        addTopRatedTvSeries: (state, action) => {
            state.topRatedTvSeries = action.payload;
        },
        addTrendingTvSeries: (state, action) => {
            state.trendingTvSeries = action.payload;
        },

    },
})

export const { addTopRatedTvSeries, addTrendingTvSeries } = TvSeriesSlice.actions;
export default TvSeriesSlice.reducer