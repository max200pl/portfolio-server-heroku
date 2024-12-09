const admin = require("firebase-admin");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");

async function uploadImageToFirebase(file, destination) {
    try {
        console.log(`Uploading image to Firebase: ${file.originalname}`);

        // Initialize storage
        const bucket = admin.storage().bucket();
        const contentType = file.mimetype;
        const fileBuffer = file.buffer;

        // Get a reference to the file in storage
        const firebaseFile = bucket.file(destination);

        // Create a stream to write data
        const stream = firebaseFile.createWriteStream({
            metadata: {
                contentType: contentType, // Set content type
            },
        });

        return new Promise((resolve, reject) => {
            stream.on("error", (err) => {
                console.error(
                    `Error uploading image to Firebase: ${err.message}`
                );
                reject(err);
            });

            stream.on("finish", () => {
                console.log(`Image uploaded to Firebase: ${destination}`);
                resolve(destination);
            });

            // Write data to the stream
            stream.end(fileBuffer);
        });
    } catch (err) {
        console.error(`Error uploading image to Firebase: ${err.message}`);
        throw err;
    }
}

async function deleteImageFromFirebase(destination) {
    try {
        const bucket = admin.storage().bucket();
        const firebaseFile = bucket.file(destination);

        return new Promise((resolve, reject) => {
            firebaseFile.delete((err) => {
                if (err) {
                    if (err.code === 404) {
                        console.log(`No such object: ${destination}`);
                        resolve();
                    } else {
                        console.error(
                            `Error deleting image from Firebase: ${err.message}`
                        );
                        reject(err);
                    }
                } else {
                    console.log(`Image deleted from Firebase: ${destination}`);
                    resolve();
                }
            });
        });
    } catch (err) {
        console.error(`Error deleting image from Firebase: ${err.message}`);
        throw err;
    }
}

/**
 * @param {string} destination
 * @returns {string} URL
 */
async function getDownloadURLFromFirebase(destination) {
    try {
        const fileRef = getStorage().bucket().file(destination);
        const url = await getDownloadURL(fileRef);

        console.log(`Download URL from Firebase: ${url}`);
        return url;
    } catch (err) {
        console.error(
            `Error getting download URL from Firebase: ${err.message}`
        );
        throw err;
    }
}

module.exports = {
    uploadImageToFirebase,
    deleteImageFromFirebase,
    getDownloadURLFromFirebase,
};
