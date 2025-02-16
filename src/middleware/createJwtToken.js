const jwt = require("jsonwebtoken");
require("dotenv").config();

async function createJwtToken(req, res, next) {
    const user = req.user;
    console.log("=== Creating JWT Token ===");
    console.log("Authenticated User:", user);

    if (!user) {
        console.info("No authenticated user found");
        console.info("=== JWT Token Creation Complete ===");
        return res.status(401).json({ message: "No authenticated user found" });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        console.error("JWT secret key is not defined in environment variables");
        console.info("=== JWT Token Creation Complete ===");
        return res.status(500).json({ message: "Internal server error" });
    }

    try {
        const token = jwt.sign(
            { uid: user.uid, email: user.email },
            secretKey,
            {
                expiresIn: "1h",
            }
        );
        console.log("JWT Token created successfully:", token);
        req.token = token; // Set the token in the request object
        console.info("=== JWT Token Creation Complete ===");
        next();
    } catch (error) {
        console.error("Error creating JWT token:", error.message);
        console.info("=== JWT Token Creation Complete ===");
        res.status(500).json({ message: "Error creating JWT token" });
    }
}

module.exports = createJwtToken;
