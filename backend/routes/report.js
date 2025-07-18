import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Report from "../models/Report.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        const {
            title,
            summary,
            bodyParts,
            location,
            voiceNote,
            media,
            severity,
            tags,
            incidentDateTime,
            isDraft,
        } = req.body;

        const newReport = new Report({
            userId: req.user.id,
            title,
            summary,
            bodyParts,
            location,
            voiceNote,
            media,
            severity,
            tags,
            incidentDateTime,
            isDraft,
        });

        const saved = await newReport.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ message: "Server error saving report" });
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id }).sort({
            createdAt: -1,
        });
        res.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Server error fetching reports" });
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const report = await Report.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!report)
            return res.status(404).json({ message: "Report not found" });
        res.json(report);
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ message: "Server error fetching report" });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updated = await Report.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!updated)
            return res.status(404).json({ message: "Report not found" });
        res.json(updated);
    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ message: "Server error updating report" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deleted = await Report.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!deleted)
            return res.status(404).json({ message: "Report not found" });
        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Server error deleting report" });
    }
});

export default router;
