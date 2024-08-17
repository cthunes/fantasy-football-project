import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
    name: "view",
    initialState: {
        view: "stats",
        overallRnkHt: [249, 249],
        maxWidth: "xl",
    },
    reducers: {
        setView: (state, action) => {
            state.view = action.payload;
        },
        setOverallRnkHt: (state, action) => {
            state.overallRnkHt = action.payload;
        },
        setMaxWidth: (state, action) => {
            state.maxWidth = action.payload;
        },
    },
});

export const { setView, setOverallRnkHt, setMaxWidth } = viewSlice.actions;

export default viewSlice.reducer;
