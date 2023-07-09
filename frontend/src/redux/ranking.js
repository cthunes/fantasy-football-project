import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/ranking";

//thunks
export const rankingFetchAll = createAsyncThunk(
    "ranking/rankingFetchAll",
    async () => {
        try {
            const { data } = await api.fetchRankings();
            return data;
        } catch (error) {
            console.log("Error fetching rankings", error.message);
            return error;
        }
    }
);

export const rankingCreate = createAsyncThunk(
    "ranking/rankingCreate",
    async (player) => {
        const { data } = await api.createRanking(player);
        return data;
    }
);

export const rankingSlice = createSlice({
    name: "ranking",
    initialState: {
        players: [],
        status: "idle",
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(rankingFetchAll.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(rankingFetchAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Add any fetched posts to the array
                state.players = state.players.concat(action.payload);
            })
            .addCase(rankingFetchAll.rejected, (state, action) => {
                state.status = "failed";
            })
            .addCase(rankingCreate.fulfilled, (state, action) => {
                state.players.push(action.payload);
            });
    },
});

export const { fetchAll, create } = rankingSlice.actions;

export default rankingSlice.reducer;
