import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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