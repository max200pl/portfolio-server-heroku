const jwt = require("jsonwebtoken");
const { logCompletion } = require("../utils/logger");
require("dotenv").config();

function verifyJwtToken(req, res, next) {
    console.log("=== Verifying JWT Token ===");
    console.log("Received Session:", req.session);

    if (!req.session || !req.session.jwt) {
        console.info("No JWT token found in session");
        logCompletion("JWT Token Verification");
        return res.status(401).json({ message: "No JWT token found" });
    }

    const token = req.session.jwt;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("JWT Token verified successfully:", decoded);
        req.user = decoded;
        logCompletion("JWT Token Verification");
        next();
    } catch (error) {
        console.error("Error verifying JWT token:", error.message);
        logCompletion("JWT Token Verification");
        res.status(401).json({ message: "Invalid JWT token" });
    }
}

module.exports = verifyJwtToken;
