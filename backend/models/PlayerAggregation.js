import mongoose from "mongoose";

const playerAggregationSchema = mongoose.Schema({}, {
    collection: "player_aggregations",
    strict: false,
    versionKey: false,
});

const PlayerAggregation = mongoose.model("PlayerAggregation", playerAggregationSchema);

export default PlayerAggregation;
