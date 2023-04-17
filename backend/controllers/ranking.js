import Ranking from "../models/Ranking.js";

export const getRankings = async (req, res) => {
    try {
        const rankings = await Ranking.find();
        res.status(200).json(rankings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createRanking = async (req, res) => {
    const ranking = req.body;
    const newRanking = new Ranking(ranking);
    try {
        await newRanking.save();
        res.status(201).json(newRanking);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteRanking = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("No rankings with that id.");
    await Ranking.findByIdAndDelete(id);
    res.json({ message: "Ranking deleted successfully" });
};
