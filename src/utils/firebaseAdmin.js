const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

let bucket;

function initializeFirebaseAdmin() {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        bucket = admin.storage().bucket();
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
    }
}

module.exports = {
    initializeFirebaseAdmin,
    bucket,
    serviceAccount, // Export service account
};
