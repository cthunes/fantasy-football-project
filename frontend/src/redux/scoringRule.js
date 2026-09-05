import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/scoringRule";

//thunks
export const scoringRuleFetchAll = createAsyncThunk(
    "scoringRule/scoringRuleFetchAll",
    async () => {
        try {
            const { data } = await api.fetchScoringRules();
            return data;
        } catch (error) {
            console.log("Error fetching scoring rules", error.message);
            return error;
        }
    }
);

export const scoringRuleSlice = createSlice({
    name: "scoringRule",
    initialState: {
        scoringRules: [],
        status: "idle",
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(scoringRuleFetchAll.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(scoringRuleFetchAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.scoringRules = action.payload;
            })
            .addCase(scoringRuleFetchAll.rejected, (state, action) => {
                state.status = "failed";
            });
    },
});

export const { fetchAll } = scoringRuleSlice.actions;

export default scoringRuleSlice.reducer;
