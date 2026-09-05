import ScoringRule from "../models/ScoringRule.js";

export const getScoringRules = async (req, res) => {
    try {
        const scoringRules = await ScoringRule.find();
        res.status(200).json(scoringRules);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};