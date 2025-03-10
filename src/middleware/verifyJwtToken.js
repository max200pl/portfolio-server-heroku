const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyJwtToken(req, res, next) {
    console.log("=== Verifying JWT Token ===");
    console.log("Received Cookies:", req.cookies);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        const cookieToken = req.cookies && req.cookies.jwt;
        if (!cookieToken) {
            console.error("No access token found in headers or cookies");
            return res.status(401).json({ message: "No access token found" });
        }
        console.log("Using token from cookie");
        verifyToken(cookieToken, req, res, next);
    } else {
        console.log("Using token from authorization header");
        verifyToken(token, req, res, next);
    }
}

function verifyToken(token, req, res, next) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Token is invalid or expired:", err.message);
            return res
                .status(403)
                .json({ message: "Token is invalid or expired" });
        }
        req.user = decoded; // { userId: ..., roles: ... }
        next();
    });
}

module.exports = verifyJwtToken;
