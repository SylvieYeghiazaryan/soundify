import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Fetches the user's listening history from Spotify using the Spotify API.
 * It categorizes each song's time of day based on when it was played.
 *
 * @param {string} accessToken - The Spotify access token for authentication.
 * @returns {Array} - A list of songs with track name, artist, played time, and time of day category.
 */
export const fetchListeningHistory = createAsyncThunk(
    "spotify/fetchListeningHistory",
    async (accessToken) => {
        const response = await axios.get(
            "https://api.spotify.com/v1/me/player/recently-played?limit=50",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data.items.map((item) => {
            const playedAtHour = new Date(item.played_at).getHours();
            const songTimeOfDay = determineCurrentTimeOfDay(playedAtHour); // Categorize song's time of day

            return {
                track_name: item.track.name,
                artist_name: item.track.artists.map((artist) => artist.name).join(", "),
                played_at: item.played_at,
                time_of_day: songTimeOfDay,
            };
        });
    }
);

/**
 * Determines the time of day based on the hour of the song's playback.
 *
 * @param {number} hour - The hour of the song's playback (0-23).
 * @returns {string} - A string representing the time of day ("Morning", "Afternoon", "Evening").
 */
export const determineCurrentTimeOfDay = (hour) => {
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    return "Evening";
};

// The initial state for the spotify slice, which includes access token, listening history, and time of day.
const spotifySlice = createSlice({
    name: "spotify",
    initialState: {
        accessToken: null,
        listeningHistory: [],
        timeOfDay: "",
        status: "idle",
    },
    reducers: {
        // Sets the access token for Spotify authentication
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        // Sets the time of day for recommendations
        setTimeOfDay: (state, action) => {
            state.timeOfDay = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListeningHistory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchListeningHistory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.listeningHistory = action.payload;
            })
            .addCase(fetchListeningHistory.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { setAccessToken, setTimeOfDay } = spotifySlice.actions;
export default spotifySlice.reducer;