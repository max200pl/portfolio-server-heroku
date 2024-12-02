const { initializeApp, getApps } = require("firebase/app");
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage");
const { serviceAccount } = require("./firebaseAdmin"); // Import Firebase config

// Initialize Firebase app if not already initialized
if (!getApps().length) {
    initializeApp(serviceAccount);
}

async function uploadImageToFirebase(file) {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.originalname}`);
        const snapshot = await uploadBytes(storageRef, file.buffer);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded to Firebase:", downloadURL);
        return downloadURL;
    } catch (err) {
        console.error(`Error uploading image to Firebase: ${err.message}`);
        throw err;
    }
}

module.exports = {
    uploadImageToFirebase,
};
