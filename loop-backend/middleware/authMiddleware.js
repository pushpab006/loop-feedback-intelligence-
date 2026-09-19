const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("TOKEN RECEIVED:", !!token);
        console.log("VERIFY SECRET LOADED:", !!process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("JWT VERIFIED SUCCESSFULLY");
        console.log("USER ID:", decoded.id);
        console.log("WORKSPACE ID:", decoded.workspaceId);

        req.user = decoded;

        next();

    } catch (error) {
        console.error("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;