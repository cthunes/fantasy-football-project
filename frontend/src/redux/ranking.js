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
    async (ranking) => {
        const { data } = await api.createRanking(ranking);
        return data;
    }
);

export const rankingSlice = createSlice({
    name: "ranking",
    initialState: {
        rankings: [],
        current: {},
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
                // Add any fetched rankings to the array
                state.rankings = action.payload;
                if (action.payload.length > 0) {
                    state.current = action.payload[action.payload.length - 1];
                }
            })
            .addCase(rankingFetchAll.rejected, (state, action) => {
                state.status = "failed";
            })
            .addCase(rankingCreate.fulfilled, (state, action) => {
                state.rankings.push(action.payload);
                state.current = action.payload;
            });
    },
});

export const { fetchAll, create } = rankingSlice.actions;

export default rankingSlice.reducer;
