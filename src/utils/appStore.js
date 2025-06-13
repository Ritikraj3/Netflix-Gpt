import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./userSlice";
import moviesReducer from "./moviesSlice"
import TvSeriesReducer from "./TvSeriesSlice"
import gptReducer from "./gptSlice"
import configReducer from "./configSlice"

const appStore = configureStore({
    reducer: {
        user: userReducer,
        movies: moviesReducer,
        TvSeries: TvSeriesReducer,
        gpt: gptReducer,
        config: configReducer,
    },
})

export default appStore