const { admin } = require("../utils/firebaseAdmin");

async function verifyIdToken(req, res, next) {
    const idToken = req.body.idToken;
    console.log("=== Verifying ID Token ===");
    console.log("Received ID Token:", idToken);

    if (!idToken) {
        console.info("No ID token provided");
        return res.status(401).json({ message: "No ID token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("ID Token verified successfully:", decodedToken);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name,
            photoURL: decodedToken.picture,
            providers: decodedToken.firebase.sign_in_provider,
        };
        next();
    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        res.status(401).json({ message: "Invalid ID token" });
    } finally {
        console.info("=== ID Token Verification Complete ===");
    }
}

module.exports = verifyIdToken;
