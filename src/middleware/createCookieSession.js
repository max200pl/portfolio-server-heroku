const cookieSession = require("cookie-session");
require("dotenv").config();

function createCookieSession(req, res, next) {
    console.log("=== Creating Cookie Session ===");
    const token = req.token;

    if (!token) {
        console.error("JWT token is missing");
        return res.status(401).json({ message: "No JWT token provided" });
    }

    // Initialize cookie session
    cookieSession({
        name: "session",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
        secure: process.env.NODE_ENV === "production", // Set secure to true in production
    })(req, res, () => {
        try {
            // Set the JWT cookie here
            res.cookie("jwt", token, {
                httpOnly: true,
                sameSite: "lax",
                path: "/", // Make cookie accessible on all routes
                secure: process.env.NODE_ENV === "production",
            });
            console.log("JWT cookie set successfully");

            // Log the cookies to ensure they are parsed correctly
            console.log("Parsed Cookies:", req.cookies);

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
