import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

export const determineCurrentTimeOfDay = (hour) => {
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    return "Evening";
};

const spotifySlice = createSlice({
    name: "spotify",
    initialState: {
        accessToken: null,
        listeningHistory: [],
        timeOfDay: "",
        status: "idle",
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
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