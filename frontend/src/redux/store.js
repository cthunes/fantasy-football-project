import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./player";
import rankingReducer from "./player";

export default configureStore({
    reducer: {
        player: playerReducer,
        ranking: rankingReducer,
    },
});
