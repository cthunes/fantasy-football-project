import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "./view";
import playerReducer from "./player";
import playerAggregationReducer from "./playerAggregation";
import rankingReducer from "./ranking";
import yearReducer from "./year";
import pointsTypeReducer from "./pointsType";
import scoringRuleReducer from "./scoringRule";
import profileReducer from "./profile";

export default configureStore({
    reducer: {
        view: viewReducer,
        player: playerReducer,
        playerAggregation: playerAggregationReducer,
        ranking: rankingReducer,
        year: yearReducer,
        pointsType: pointsTypeReducer,
        scoringRule: scoringRuleReducer,
        profile: profileReducer,
    },
});
