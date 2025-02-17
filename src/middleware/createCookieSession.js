const cookieSession = require("cookie-session");
const { logCompletion } = require("../utils/logger");
require("dotenv").config();

function createCookieSession(req, res, next) {
    console.log("=== Creating Cookie Session ===");
    const token = req.token;

    if (!token) {
        console.error("JWT token is missing");
        return res.status(401).json({ message: "No JWT token provided" });
    }

    cookieSession({
        name: "session",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
        secure: process.env.NODE_ENV === "production", // Set secure to true in production
    })(req, res, () => {
        try {
            req.session.jwt = token;
            req.session.user = req.user;
            console.log("Session created successfully:", req.session);
            next();
        } catch (error) {
            console.error("Error creating session:", error.message);
            res.status(500).json({ message: "Internal server error" });
        } finally {
            logCompletion("Cookie Session Creation");
            console.info("=== Cookie Session Creation Complete ===");
        }
    });
}

module.exports = createCookieSession;
