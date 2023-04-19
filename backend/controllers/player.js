import Player from "../models/Player.js";

export const getPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPlayer = async (req, res) => {
    const player = req.body;
    const newPlayer = new Player(player);
    try {
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
