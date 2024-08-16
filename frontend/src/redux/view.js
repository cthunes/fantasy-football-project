import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
    name: "view",
    initialState: {
        view: "stats",
        overallRnkHt: 249,
    },
    reducers: {
        setView: (state, action) => {
            state.view = action.payload;
        },
        setOverallRnkHt: (state, action) => {
            state.overallRnkHt = action.payload;
        },
    },
});

export const { setView, setOverallRnkHt } = viewSlice.actions;

export default viewSlice.reducer;
