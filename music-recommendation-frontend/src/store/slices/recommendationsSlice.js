import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Fetches metadata (URI and album cover) for a given track and artist using the Spotify API.
 *
 * @param {string} trackName - The name of the track.
 * @param {string} artistName - The name of the artist.
 * @param {string} accessToken - The Spotify access token for authentication.
 * @returns {object} - An object containing the URI of the track and its album cover URL.
 */
const fetchSongMetadata = async (trackName, artistName, accessToken) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            params: {
                q: `track:${trackName} artist:${artistName}`,
                type: "track",
                limit: 1,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const track = response.data.tracks.items[0];
        if (!track) {
            return { uri: null, albumCover: 'src/images/No_cover.jpeg' };
        }

        return {
            uri: track.uri,
            albumCover: track.album.images[0]?.url || "https://via.placeholder.com/150",
        };
    } catch (error) {
        console.error(`Error fetching metadata for: ${trackName} by ${artistName}`, error);
        return { uri: null, albumCover: "https://via.placeholder.com/150" };
    }
};

/**
 * Fetches music recommendations based on the user's listening history and time of day.
 * It sends the request to the backend and fetches metadata for each song in the response.
 *
 * @param {object} param0 - The payload containing time_of_day, listening_history, and accessToken.
 * @param {string} param0.time_of_day - The time of day (e.g., "Morning", "Afternoon").
 * @param {Array} param0.listening_history - The list of songs in the user's listening history.
 * @param {string} param0.accessToken - The Spotify access token for authentication.
 * @returns {Array} - A list of recommended songs, each with track name, artist, genre, URI, and album cover.
 */
export const fetchRecommendations = createAsyncThunk(
    "spotify/fetchRecommendations",
    async ({ time_of_day, listening_history, accessToken }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/recommendations",
                { time_of_day, listening_history },
                { headers: { "Content-Type": "application/json" } }
            );

            const updatedRecommendations = await Promise.all(
                response.data.recommendations.map(async (rec) => {
                    const metadata = await fetchSongMetadata(
                        rec.track_name,
                        rec.artist_name,
                        accessToken
                    );
                    return { ...rec, uri: metadata.uri, albumCover: metadata.albumCover };
                })
            );

            return updatedRecommendations;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetches filtered music recommendations based on the user's time of day, listening history, genre, and mood.
 * It sends the request to the backend and fetches metadata for each song in the response.
 *
 * @param {object} param0 - The payload containing time_of_day, listening_history, genre, mood, and accessToken.
 * @param {string} param0.time_of_day - The time of day (e.g., "Morning", "Afternoon").
 * @param {Array} param0.listening_history - The list of songs in the user's listening history.
 * @param {string} param0.genre - The preferred genre for filtering.
 * @param {string} param0.mood - The current mood for filtering.
 * @param {string} param0.accessToken - The Spotify access token for authentication.
 * @returns {Array} - A list of filtered recommendations with track name, artist, genre, URI, and album cover.
 */
export const fetchFilteredRecommendations = createAsyncThunk(
    "spotify/fetchFilteredRecommendations",
    async ({ time_of_day, listening_history, genre, mood, accessToken }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/filtered-recommendations",
                { time_of_day, listening_history, genre, mood },
                { headers: { "Content-Type": "application/json" } }
            );

            const updatedRecommendations = await Promise.all(
                response.data.recommendations.map(async (rec) => {
                    const metadata = await fetchSongMetadata(
                        rec.track_name,
                        rec.artist_name,
                        accessToken
                    );
                    return { ...rec, uri: metadata.uri, albumCover: metadata.albumCover };
                })
            );

            return updatedRecommendations;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Fetches music recommendations based on a natural language search query.
 * It sends the request to the backend and fetches metadata for each song in the response.
 *
 * @param {object} param0 - The payload containing the search query and accessToken.
 * @param {string} param0.query - The natural language search query.
 * @param {string} param0.accessToken - The Spotify access token for authentication.
 * @returns {Array} - A list of recommendations based on the search query with track name, artist, URI, and album cover.
 */
export const fetchSearchRecommendations = createAsyncThunk(
    "spotify/fetchSearchRecommendations",
    async ({ query, accessToken }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/search-recommendations",
                { query },
                { headers: { "Content-Type": "application/json" } }
            );

            const updatedRecommendations = await Promise.all(
                response.data.recommendations.map(async (rec) => {
                    const metadata = await fetchSongMetadata(
                        rec.track_name,
                        rec.artist_name,
                        accessToken
                    );
                    return { ...rec, uri: metadata.uri, albumCover: metadata.albumCover };
                })
            );

            return updatedRecommendations;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// The initial state for the recommendations slice, including recommendations, loading state, and any errors.
const recommendationsSlice = createSlice({
    name: "spotify",
    initialState: {
        recommendations: [],
        error: null,
        loading: false,
    },
    reducers: {
        clearRecommendations(state) {
            state.recommendations = [];
        },
    },
    extraReducers: (builder) => {
        // Handle fetchRecommendations
        builder
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
                state.loading = false;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });

        // Handle fetchFilteredRecommendations
        builder
            .addCase(fetchFilteredRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredRecommendations.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });

        // Handle fetchSearchRecommendations
        builder
            .addCase(fetchSearchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
                state.loading = false;
            })
            .addCase(fetchSearchRecommendations.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;