import { configureStore } from '@reduxjs/toolkit';
import spotifyReducer from './slices/spotifySlice'
import recommendationsReducer from './slices/recommendationsSlice'


export const store = configureStore({
    reducer: {
        spotify: spotifyReducer,
        recommendations: recommendationsReducer,
    },
});