const cookieSession = require("cookie-session");
const { logCompletion } = require("../utils/logger");
require("dotenv").config();

function createCookieSession(req, res, next) {
    console.log("=== Creating Cookie Session ===");
    console.log("JWT Token:", req.jwtToken);

    if (!req.jwtToken) {
        console.info("No JWT token provided");
        logCompletion("Cookie Session Creation");
        return res.status(401).json({ message: "No JWT token provided" });
    }

    cookieSession({
        name: "session",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
    })(req, res, () => {
        try {
            req.session.jwt = req.jwtToken;
            req.session.user = req.user;
            console.log("Session created successfully:", req.session);
            logCompletion("Cookie Session Creation");
            next();
        } catch (error) {
            console.error("Error creating session:", error.message);
            logCompletion("Cookie Session Creation");
            res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports = createCookieSession;
