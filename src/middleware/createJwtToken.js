const jwt = require("jsonwebtoken");
require("dotenv").config();

function createJwtToken(req, res, next) {
    const user = req.user;
    console.log("=== Creating JWT Token ===");
    console.log("Authenticated User:", user);

    if (!user) {
        console.info("User not authenticated");
        console.info("=== JWT Token Creation Complete ===");
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
        console.info("=== JWT Token Creation Complete ===");
        next();
    } catch (error) {
        console.error("Error creating JWT token:", error.message);
        console.info("=== JWT Token Creation Complete ===");
        res.status(500).json({ message: "Error creating JWT token" });
    }
}

module.exports = createJwtToken;
