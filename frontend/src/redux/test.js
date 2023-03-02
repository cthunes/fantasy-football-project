import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

//thunks
export const testFetchAll = createAsyncThunk("test/testFetchAll", async () => {
    try {
        const { data } = await api.fetchTest();
        return data;
    } catch (error) {
        console.log("Error fetching test", error.message);
        return error;
    }
});

export const testCreate = createAsyncThunk(
    "test/testCreate",
    async (player) => {
        const { data } = await api.createTest(player);
        return data;
    }
);

export const testSlice = createSlice({
    name: "test",
    initialState: {
        players: [],
        status: "idle",
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(testFetchAll.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(testFetchAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Add any fetched posts to the array
                state.players = state.players.concat(action.payload);
            })
            .addCase(testFetchAll.rejected, (state, action) => {
                state.status = "failed";
            })
            .addCase(testCreate.fulfilled, (state, action) => {
                state.players.push(action.payload);
            });
    },
});

export const { fetchAll, create } = testSlice.actions;

export default testSlice.reducer;
