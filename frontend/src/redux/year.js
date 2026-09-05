import { createSlice } from "@reduxjs/toolkit";

export const yearSlice = createSlice({
    name: "year",
    initialState: {
        year: "ALL",
    },
    reducers: {
        setYear: (state, action) => {
            state.year = action.payload;
        },
    },
});

export const { setYear } = yearSlice.actions;

export default yearSlice.reducer;
