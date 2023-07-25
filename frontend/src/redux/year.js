import { createSlice } from "@reduxjs/toolkit";

export const yearSlice = createSlice({
    name: "year",
    initialState: {
        year: "4 year weighted average",
    },
    reducers: {
        setYear: (state, action) => {
            state.year = action.payload;
        },
    },
});

export const { setYear } = yearSlice.actions;

export default yearSlice.reducer;
