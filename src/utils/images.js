// создать на основе папки images json
const fs = require("fs").promises;
const path = require("path");
const { encode } = require("blurhash");
const sharp = require("sharp");
const { toCamelCase } = require("../helpers/helpers");
const {
    uploadImageToFirebase,
    deleteImageFromFirebase,
    getDownloadURLFromFirebase,
} = require("../utils/firebaseStorage"); // Corrected path
const { v4: uuidv4 } = require("uuid");

// ========  HELPERS ========== //

const IMAGES_DIR_PATH = path.join(__dirname, "..", "images");
const IMAGES_JSON_DIR_PATH = path.join(__dirname, "..", "data", "images.json");

const getImageName = (str) => {
    return str.slice(str.indexOf("/") + 1);
};

const getFolderName = (str) => {
    return str.slice(0, str.indexOf("/"));
};

async function getLocalImages() {
    try {
        const localImagesJSON = await fs.readFile(IMAGES_JSON_DIR_PATH);
        const { images } = JSON.parse(localImagesJSON);

        console.log("Images Local Successfully PARSE");
        return images;
    } catch (error) {
        console.log(error.message);
    }
}

// ========  /helpers ========== //

async function generateBlurHash(buffer) {
    try {
        const blurHash = await new Promise((resolve, reject) => {
            sharp(buffer)
                .raw()
                .ensureAlpha()
                .resize(16, 16, { fit: "inside" }) // Adjusted size for better performance
                .toBuffer((err, buffer, { width, height }) => {
                    if (err) return reject(err);
                    resolve(
                        encode(
                            new Uint8ClampedArray(buffer),
                            width,
                            height,
                            4,
                            4
                        )
                    );
                });
        });
        console.log("Generated blur hash for image:", blurHash);
        return blurHash;
    } catch (err) {
        console.error(`Error processing image: ${err.message}`);
        throw err;
    }
}

/**
 * Uploads an image to Firebase and returns the image URL
 * @param {{
 * image: { name: string },
 * file: { buffer: Buffer, originalname: string },
 * type: string
 * }} param
 */
async function handleImageUpload({ image, file, type }) {
    const destination = generateImageDestination({
        type,
        name: image.name,
        file,
    });

    await uploadImageToFirebase(file, destination);
    const imageUrl = await getDownloadURLFromFirebase(destination);
    const blurHash = await generateBlurHash(file.buffer);
    return {
        blurHash,
        destination,
        url: imageUrl,
        size: file.size,
    };
}

async function handleImageDeletion(cardImage) {
    if (cardImage && cardImage.destination) {
        console.log("Deleting image from Firebase:", cardImage.destination);
        await deleteImageFromFirebase(cardImage.destination);
    } else {
        console.log(
            "No cardImage or destination found, skipping image deletion."
        );
    }
}

/**
 * Generate a unique image destination path
 * @param {{
 *  type: "works" | "certificates",
 *  name: string,
 *  file: {
 *    originalname: string
 *  }
 * }} destination - The type of image
 * @returns {string} - The image destination path
 */
function generateImageDestination({ type, name, file }) {
    const uniqueId = uuidv4({
        rng: uuidv4.nodeRNG, // Use node.js crypto module for random values
    });
    const camelCaseName = toCamelCase(name);
    const fileType = path.extname(file.originalname);
    return `images/${type}/${camelCaseName}/${camelCaseName}_${uniqueId}${fileType}`;
}

module.exports = {
    generateBlurHash,
    getImageName,
    getFolderName,
    getLocalImages,
    handleImageUpload,
    handleImageDeletion,
    generateImageDestination,
};
