import Profile from "../models/Profile.js";

export const getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};