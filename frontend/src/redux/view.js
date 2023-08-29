import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
    name: "view",
    initialState: {
        view: "stats",
    },
    reducers: {
        setView: (state, action) => {
            state.view = action.payload;
        },
    },
});

export const { setView } = viewSlice.actions;

export default viewSlice.reducer;
