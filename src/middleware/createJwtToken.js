const jwt = require("jsonwebtoken");
const { logCompletion } = require("../utils/logger");
require("dotenv").config();

function createJwtToken(req, res, next) {
    const user = req.user;
    console.log("=== Creating JWT Token ===");
    console.log("Authenticated User:", user);

    if (!user) {
        console.info("User not authenticated");
        logCompletion("JWT Token Creation");
        return res.status(401).json({ message: "User not authenticated" });
    }

    const payload = {
        uid: user.uid,
        email: user.email,
    };

    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        console.log("JWT Token created successfully:", token);
        req.jwtToken = token;
        logCompletion("JWT Token Creation");
        next();
    } catch (error) {
        console.error("Error creating JWT token:", error.message);
        logCompletion("JWT Token Creation");
        res.status(500).json({ message: "Error creating JWT token" });
    }
}

module.exports = createJwtToken;
