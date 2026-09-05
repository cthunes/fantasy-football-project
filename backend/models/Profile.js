import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        includePlayoffs: {
            type: Boolean,
            required: true,
        },
        rules: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        collection: "profiles",
        versionKey: false,
    }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;