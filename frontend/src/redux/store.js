import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./player";
import rankingReducer from "./ranking";
import yearReducer from "./year";
import pointsTypeReducer from "./pointsType";

export default configureStore({
    reducer: {
        player: playerReducer,
        ranking: rankingReducer,
        year: yearReducer,
        pointsType: pointsTypeReducer,
    },
});
