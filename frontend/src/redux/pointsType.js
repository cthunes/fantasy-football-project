import { createSlice } from "@reduxjs/toolkit";

export const pointsTypeSlice = createSlice({
    name: "pointsType",
    initialState: {
        pointsType: "half",
    },
    reducers: {
        setPointsType: (state, action) => {
            state.pointsType = action.payload;
        },
    },
});

export const { setPointsType } = pointsTypeSlice.actions;

export default pointsTypeSlice.reducer;
