const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyJwtToken(req, res, next) {
    console.log("=== Verifying JWT Token ===");
    const token = req.session.jwt;

    if (!token) {
        console.info("No JWT token found in session");
        console.info("=== JWT Token Verification Complete ===");
        return res.status(401).json({ message: "No JWT token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("JWT Token verified successfully:", decoded);
        console.info("=== JWT Token Verification Complete ===");
        next();
    } catch (error) {
        console.error("Error verifying JWT token:", error.message);
        console.info("=== JWT Token Verification Complete ===");
        res.status(401).json({ message: "Invalid JWT token" });
    }
}

module.exports = verifyJwtToken;
