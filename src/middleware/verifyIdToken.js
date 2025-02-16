const { admin } = require("../utils/firebaseAdmin");

async function verifyIdToken(req, res, next) {
    const idToken = req.body.idToken;
    console.log("=== Verifying ID Token ===");
    console.log("Received ID Token:", idToken);

    if (!idToken) {
        console.info("No ID token provided");
        console.info("=== ID Token Verification Complete ===");
        return res.status(401).json({ message: "No ID token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("ID Token verified successfully:", decodedToken);
        req.user = decodedToken;
        console.info("=== ID Token Verification Complete ===");
        next();
    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        console.info("=== ID Token Verification Complete ===");
        res.status(401).json({ message: "Invalid ID token" });
    }
}

module.exports = verifyIdToken;
