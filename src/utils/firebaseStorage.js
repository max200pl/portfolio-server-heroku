const admin = require("firebase-admin");

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

module.exports = {
    uploadImageToFirebase,
};
