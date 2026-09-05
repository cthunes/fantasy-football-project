import mongoose from "mongoose";

const scoringRuleSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rules: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        collection: "scoring_rules",
        versionKey: false,
    }
);

const ScoringRule = mongoose.model("ScoringRule", scoringRuleSchema);

export default ScoringRule;