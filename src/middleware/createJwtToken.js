const jwt = require("jsonwebtoken");
require("dotenv").config();

async function createJwtToken(req, res, next) {
    const user = req.user;
    console.log("=== Creating JWT Token ===");
    console.log("Authenticated User:", user);

    if (!user) {
        console.error("User data is missing");
        return res.status(401).json({ message: "User data is missing" });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        console.error("JWT secret key is not defined in environment variables");
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
        next();
    } catch (error) {
        console.error("Error creating JWT token:", error.message);
        res.status(500).json({ message: "Error creating JWT token" });
    } finally {
        console.info("=== JWT Token Creation Complete ===");
    }
}

module.exports = createJwtToken;
