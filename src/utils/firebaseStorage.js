const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { bucket } = require("./firebaseAdmin"); // Import bucket from firebaseAdmin

async function uploadImageToFirebase(file) {
    try {
        const storageRef = ref(bucket, `images/${file.originalname}`);
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
