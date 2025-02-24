const cookieSession = require("cookie-session");
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
            res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            console.log("Cookie session created successfully");
            next();
        } catch (error) {
            console.error("Error creating cookie session:", error.message);
            res.status(500).json({ message: "Internal server error" });
        } finally {
            console.info("=== Cookie Session Creation Complete ===");
        }
    });
}

module.exports = createCookieSession;
