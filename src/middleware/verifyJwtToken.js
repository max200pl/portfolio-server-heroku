const jwt = require("jsonwebtoken");
const { logCompletion } = require("../utils/logger");
require("dotenv").config();

function verifyJwtToken(req, res, next) {
    console.log("=== Verifying JWT Token ===");
    const token = req.session.jwt;

    if (!token) {
        console.info("No JWT token found in session");
        logCompletion("JWT Token Verification");
        return res.status(401).json({ message: "No JWT token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT Token verified successfully:", decoded);
        logCompletion("JWT Token Verification");
        next();
    } catch (error) {
        console.error("Error verifying JWT token:", error.message);
        logCompletion("JWT Token Verification");
        res.status(401).json({ message: "Invalid JWT token" });
    }
}

module.exports = verifyJwtToken;
