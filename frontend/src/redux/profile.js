import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/profile";

//thunks
export const profileFetchAll = createAsyncThunk(
    "profile/profileFetchAll",
    async () => {
        try {
            const { data } = await api.fetchProfiles();
            return data;
        } catch (error) {
            console.log("Error fetching profiles", error.message);
            return error;
        }
    }
);

export const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profiles: [],
        status: "idle",
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(profileFetchAll.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(profileFetchAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.profiles = action.payload;
            })
            .addCase(profileFetchAll.rejected, (state, action) => {
                state.status = "failed";
            });
    },
});

export const { fetchAll } = profileSlice.actions;

export default profileSlice.reducer;
