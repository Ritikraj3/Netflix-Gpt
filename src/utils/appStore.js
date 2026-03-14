import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./userSlice";
import moviesReducer from "./moviesSlice"
import TvSeriesReducer from "./TvSeriesSlice"
import gptReducer from "./gptSlice"
import configReducer from "./configSlice"
import watchlistReducer from "./watchlistSlice"
import trailerModalReducer from "./trailerModalSlice"
import chatReducer from "./chatSlice"

const appStore = configureStore({
    reducer: {
        user: userReducer,
        movies: moviesReducer,
        TvSeries: TvSeriesReducer,
        gpt: gptReducer,
        config: configReducer,
        watchlist: watchlistReducer,
        trailerModal: trailerModalReducer,
        chat: chatReducer,
    },
})

export default appStore