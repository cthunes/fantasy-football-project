import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/player";

//thunks
export const playerFetchAll = createAsyncThunk(
    "player/playerFetchAll",
    async () => {
        try {
            const { data } = await api.fetchPlayers();
            return data;
        } catch (error) {
            console.log("Error fetching players", error.message);
            return error;
        }
    }
);

export const playerSlice = createSlice({
    name: "player",
    initialState: {
        players: [],
        status: "idle",
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(playerFetchAll.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(playerFetchAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.players = action.payload;
            })
            .addCase(playerFetchAll.rejected, (state, action) => {
                state.status = "failed";
            });
    },
});

export const { fetchAll } = playerSlice.actions;

export default playerSlice.reducer;
