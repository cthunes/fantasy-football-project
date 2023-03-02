import Test from "../models/test.js";

export const getTest = async (req, res) => {
    try {
        const test = await Test.find();
        console.log(test);
        res.status(200).json(test);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createTest = async (req, res) => {
    const body = req.body;
    const newTest = new Test(body);
    try {
        await newTest.save();
        res.status(201).json(newTest);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
