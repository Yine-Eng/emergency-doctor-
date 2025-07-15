import mongoose from "mongoose";

const FirstAidGuideSchema = new mongoose.Schema(
    {
        condition: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        steps: {
            type: [String],
            required: true,
        },
        imageUrl: {
            type: String,
            default: null, // allow missing image
        },
        source: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true, // includes createdAt and updatedAt
    }
);

const FirstAidGuide =
    mongoose.models.FirstAidGuide ||
    mongoose.model("FirstAidGuide", FirstAidGuideSchema);

export default FirstAidGuide;
