const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(
    __dirname,
    "../../firebase-adminsdk.json"
));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "portfolio-react-5b7d3.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
