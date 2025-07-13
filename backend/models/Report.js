import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        default: "",
    },
    selectedBodyParts: {
        type: [String],
        default: [],
    },
    location: {
        lat: Number,
        lng: Number,
        address: String,
    },
    voiceNoteUrl: {
        type: String,
        default: null,
    },
    mediaUrls: {
        type: [String],
        default: [],
    },
    severity: {
        type: String,
        enum: ["mild", "moderate", "severe"],
        default: null,
    },
    tags: {
        type: [String],
        default: [],
    },
    incidentDateTime: {
        type: Date,
        default: Date.now,
    },
    isDraft: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Report", reportSchema);
