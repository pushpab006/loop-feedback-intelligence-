const express = require("express");
const db = require("../db");
const askLoop = require("../ai/askLoop");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const feedbacks = await db.orm.public.Feedback.all();

        const feedbackContext = feedbacks
            .map((item) => {
                return `Feedback: ${item.feedback}
Sentiment: ${item.sentiment || "Not analyzed"}
Score: ${item.score || "Not analyzed"}
Feature Area: ${item.featureArea || "Not analyzed"}`;
            })
            .join("\n\n");

        const answer = await askLoop(question, feedbackContext);

        res.json({
            answer: answer
        });

    } catch (error) {
        console.error("Ask LOOP error:", error);

        res.status(500).json({
            message: "Failed to process Ask LOOP question"
        });
    }
});

module.exports = router;