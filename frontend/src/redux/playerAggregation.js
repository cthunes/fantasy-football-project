import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/playerAggregation";

//thunks
export const playerAggregationFetchAll = createAsyncThunk(
    "player/playerAggregationFetchAll",
    async () => {
        try {
            const { data } = await api.fetchPlayerAggregations();
            return data;
        } catch (error) {
            console.log("Error fetching player aggregations", error.message);
            return error;
        }
    }
);

export const playerAggregationSlice = createSlice({
    name: "playerAggregation",
    initialState: {
        playerAggregations: [],
        status: "idle",
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(playerAggregationFetchAll.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(playerAggregationFetchAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.playerAggregations = action.payload;
            })
            .addCase(playerAggregationFetchAll.rejected, (state, action) => {
                state.status = "failed";
            });
    },
});

export const { fetchAll } = playerAggregationSlice.actions;

export default playerAggregationSlice.reducer;
