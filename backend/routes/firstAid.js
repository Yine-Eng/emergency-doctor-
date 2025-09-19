import express from "express";
import FirstAidGuide from "../models/FirstAidGuide.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.condition = { $regex: new RegExp(search, "i") };
        }
        const results = await FirstAidGuide.find(query).sort("condition");
        res.json(results);
    } catch (err) {
        console.error("[GET /first-aid]", err);
        res.status(500).json({ message: "Failed to fetch first aid guides" });
    }
});

router.get("/:condition", async (req, res) => {
    try {
        const { condition } = req.params;
        const guide = await FirstAidGuide.findOne({
            condition: { $regex: new RegExp(`^${condition}$`, "i") },
        });
        if (!guide)
            return res.status(404).json({ message: "Condition not found" });
        res.json(guide);
    } catch (err) {
        console.error("[GET /first-aid/:condition]", err);
        res.status(500).json({ message: "Error retrieving guide" });
    }
});

export default router;
