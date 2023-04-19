import mongoose from "mongoose";

const rankInfoSchema = mongoose.Schema({
    rank: Number,
    name: String,
    team: String,
    player_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Player",
    },
});

const rankingSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    rankings: {
        overall: [rankInfoSchema],
        qb: [rankInfoSchema],
        rb: [rankInfoSchema],
        wr: [rankInfoSchema],
        te: [rankInfoSchema],
        k: [rankInfoSchema],
        dst: [rankInfoSchema],
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const Ranking = mongoose.model("Ranking", rankingSchema);

export default Ranking;
