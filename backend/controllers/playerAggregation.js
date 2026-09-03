import PlayerAggregation from "../models/PlayerAggregation.js";

export const getPlayerAggregations = async (req, res) => {
    try {
        const playerAggregations = await PlayerAggregation.find();
        res.status(200).json(playerAggregations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};