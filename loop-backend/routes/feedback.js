const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const stream = require("stream");

const db = require("../db");
const analyzeFeedback = require("../ai/analyzeFeedback");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

const upload = multer({
    storage: multer.memoryStorage()
});


// =====================================================
// GET ALL FEEDBACK
// =====================================================

router.get("/", async (req, res) => {
    try {
        const allFeedback =
            await db.orm.public.Feedback.all();

        const feedbacks = allFeedback.filter(
            (feedback) =>
                feedback.workspaceId === req.user.workspaceId
        );

        return res.json(feedbacks);

    } catch (error) {
        console.error("GET FEEDBACK ERROR:", error.stack);

        return res.status(500).json({
            message: "Failed to fetch feedback",
            error: error.message
        });
    }
});


// =====================================================
// POST NEW FEEDBACK
// =====================================================

router.post(
    "/",
    roleMiddleware("ADMIN", "ANALYST"),
    async (req, res) => {

        console.log("POST FEEDBACK ROUTE REACHED");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        try {
            const { feedback } = req.body;

            if (!feedback || !feedback.trim()) {
                return res.status(400).json({
                    message: "Feedback is required"
                });
            }

            console.log("CALLING AI FUNCTION");

            const aiResult =
                await analyzeFeedback(feedback);

            console.log("AI ANALYSIS:", aiResult);

            const result =
                await db.orm.public.Feedback.create({
                    feedback: feedback,
                    sentiment: aiResult.sentiment,
                    score: aiResult.score,
                    featureArea: aiResult.featureArea,
                    workspaceId: req.user.workspaceId
                });

            return res.status(201).json({
                message: "Feedback saved successfully",
                feedback: result,
                aiAnalysis: aiResult
            });

        } catch (error) {

            console.error(
                "POST FEEDBACK ERROR:",
                error.stack
            );

            return res.status(500).json({
                message: "Failed to save feedback",
                error: error.message
            });
        }
    }
);


// =====================================================
// UPDATE FEEDBACK STATUS
// =====================================================

router.patch(
    "/:id/status",
    roleMiddleware("ADMIN", "ANALYST"),
    async (req, res) => {

        console.log(
            "PATCH STATUS:",
            req.params.id,
            req.body
        );

        try {

            const id = Number(req.params.id);
            const { status } = req.body;

            if (!Number.isInteger(id)) {
                return res.status(400).json({
                    message: "Invalid feedback ID"
                });
            }

            if (
                !["NEW", "REVIEWED", "ACTIONED"].includes(status)
            ) {
                return res.status(400).json({
                    message: "Invalid status"
                });
            }

            console.log(
                "CHECKING FEEDBACK:",
                id,
                "WORKSPACE:",
                req.user.workspaceId
            );

            // Get all feedback and find the correct workspace record
            const allFeedback =
                await db.orm.public.Feedback.all();

            const existingFeedback =
                allFeedback.find(
                    (feedback) =>
                        feedback.id === id &&
                        feedback.workspaceId === req.user.workspaceId
                );

            if (!existingFeedback) {
                return res.status(404).json({
                    message: "Feedback not found"
                });
            }

            console.log(
                "FEEDBACK FOUND:",
                existingFeedback.id
            );

            const updatedFeedback =
                await db.orm.public.Feedback.update({
                    where: {
                        id: id
                    },
                    data: {
                        status: status
                    }
                });

            console.log(
                "STATUS UPDATED:",
                updatedFeedback
            );

            return res.status(200).json({
                message: "Status updated successfully",
                feedback: updatedFeedback
            });

        } catch (error) {

            console.error(
                "STATUS UPDATE ERROR:",
                error.stack
            );

            return res.status(500).json({
                message: "Failed to update status",
                error: error.message
            });
        }
    }
);


// =====================================================
// CSV BULK UPLOAD
// =====================================================

router.post(
    "/upload-csv",
    roleMiddleware("ADMIN", "ANALYST"),
    upload.single("file"),
    async (req, res) => {

        console.log("CSV UPLOAD ROUTE REACHED");
        console.log("USER:", req.user);

        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "CSV file is required"
                });
            }

            const rows = [];

            const readable =
                stream.Readable.from(req.file.buffer);

            readable
                .pipe(csv())
                .on("data", (row) => {
                    rows.push(row);
                })
                .on("end", async () => {

                    try {

                        if (rows.length === 0) {
                            return res.status(400).json({
                                message: "CSV file is empty"
                            });
                        }

                        let imported = 0;

                        for (const row of rows) {

                            const feedbackText =
                                row.feedback;

                            if (
                                !feedbackText ||
                                !feedbackText.trim()
                            ) {
                                continue;
                            }

                            let aiResult = {
                                sentiment: null,
                                score: null,
                                featureArea: null
                            };

                            try {

                                aiResult =
                                    await analyzeFeedback(
                                        feedbackText
                                    );

                                console.log(
                                    "AI Analysis:",
                                    aiResult
                                );

                            } catch (error) {

                                console.error(
                                    "AI analysis failed. Saving without AI."
                                );
                            }

                            await db.orm.public.Feedback.create({
                                feedback: feedbackText,
                                sentiment: aiResult.sentiment,
                                score: aiResult.score,
                                featureArea:
                                    aiResult.featureArea,
                                workspaceId:
                                    req.user.workspaceId
                            });

                            imported++;
                        }

                        return res.status(200).json({
                            message:
                                `${imported} feedback items imported successfully`
                        });

                    } catch (error) {

                        console.error(
                            "CSV PROCESSING ERROR:",
                            error.stack
                        );

                        return res.status(500).json({
                            message:
                                "Failed to process CSV",
                            error: error.message
                        });
                    }
                })
                .on("error", (error) => {

                    console.error(
                        "CSV READING ERROR:",
                        error
                    );

                    return res.status(400).json({
                        message: "Invalid CSV file"
                    });
                });

        } catch (error) {

            console.error(
                "CSV UPLOAD ERROR:",
                error.stack
            );

            return res.status(500).json({
                message: "CSV upload failed",
                error: error.message
            });
        }
    }
);


module.exports = router;