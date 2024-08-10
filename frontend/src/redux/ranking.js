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

export const rankingUpdate = createAsyncThunk(
    "ranking/rankingUpdate",
    async (ranking) => {
        const { data } = await api.updateRanking(ranking.id, ranking);
        return data;
    }
);

export const rankingSlice = createSlice({
    name: "ranking",
    initialState: {
        rankings: [],
        current: {},
        drafted: [],
        unavailable: [],
        newPlayerCount: 0,
        status: "idle",
    },
    reducers: {
        setCurrent: (state, action) => {
            state.current = action.payload;
            state.drafted = [];
            state.unavailable = [];
        },
        setDrafted: (state, action) => {
            state.drafted = action.payload;
        },
        setUnavailable: (state, action) => {
            state.unavailable = action.payload;
        },
        setNewPlayerCount: (state, action) => {
            state.newPlayerCount = action.payload;
        },
    },
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
                state.drafted = [];
                state.unavailable = [];
            })
            .addCase(rankingFetchAll.rejected, (state, action) => {
                state.status = "failed";
            })
            .addCase(rankingCreate.fulfilled, (state, action) => {
                state.rankings = [...state.rankings, action.payload];
                state.current = action.payload;
            })
            .addCase(rankingUpdate.fulfilled, (state, action) => {
                state.rankings = state.rankings.filter(
                    (ranking) => ranking.name !== action.payload.name
                );
                state.rankings = [...state.rankings, action.payload];
                state.current = action.payload;
                state.drafted = [];
                state.unavailable = [];
            });
    },
});

export const {
    fetchAll,
    create,
    update,
    setCurrent,
    setDrafted,
    setUnavailable,
    setNewPlayerCount,
} = rankingSlice.actions;

export default rankingSlice.reducer;
