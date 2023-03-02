import { configureStore } from "@reduxjs/toolkit";
import testReducer from "./test";

export default configureStore({
    reducer: {
        test: testReducer,
    },
});
