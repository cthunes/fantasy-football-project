import mongoose from "mongoose";

const testSchema = mongoose.Schema({
    name: String,
    position: String,
    fpoints: Number,
});

const Test = mongoose.model("Test", testSchema);

export default Test;
