const express = require("express");
const cors = require("cors");
require("dotenv").config();

const feedbackRoutes = require("./routes/feedback");
const askLoopRoutes = require("./routes/askLoop");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

// API ROUTES
app.use("/api/feedback", feedbackRoutes);
app.use("/api/ask-loop", askLoopRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// TEST USERS ROUTE
app.get("/api/users-test", (req, res) => {
    res.json({
        message: "Users route is working"
    });
});

// HOME
app.get("/", (req, res) => {
    res.json({
        message: "LOOP Backend is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});

setInterval(() => {}, 1000);