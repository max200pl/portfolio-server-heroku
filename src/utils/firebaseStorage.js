const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage");
async function uploadImageToFirebase(file) {
    try {
        const storage = getStorage(
            firebaseAp,
            "gs://portfolio-react-5b7d3.firebasestorage.app"
        ); // Correct initialization
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
