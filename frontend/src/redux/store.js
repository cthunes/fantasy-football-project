import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "./view";
import playerReducer from "./player";
import rankingReducer from "./ranking";
import yearReducer from "./year";
import pointsTypeReducer from "./pointsType";

export default configureStore({
    reducer: {
        view: viewReducer,
        player: playerReducer,
        ranking: rankingReducer,
        year: yearReducer,
        pointsType: pointsTypeReducer,
    },
});
