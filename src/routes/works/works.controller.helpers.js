const {
    generateImageDestination,
    parseDeep,
} = require("../../helpers/helpers");
const {
    uploadImageToFirebase,
    deleteImageFromFirebase,
    getDownloadURLFromFirebase,
} = require("../../utils/firebaseStorage");
const { generateBlurHash } = require("../../utils/images");

async function handleImageUpload(work, image) {
    const destination = generateImageDestination("works", work.name, image);
    const blurHash = await generateBlurHash(image.buffer);
    await uploadImageToFirebase(image, destination);
    const imageUrl = await getDownloadURLFromFirebase(destination);

    return {
        blurHash: blurHash,
        destination: destination,
        url: imageUrl,
        size: image.size,
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

function removeEmptyFields(obj) {
    for (const key in obj) {
        if (
            obj[key] === undefined ||
            obj[key] === null ||
            obj[key] === "" ||
            obj[key] === false ||
            obj[key] === 0 ||
            (Array.isArray(obj[key]) && obj[key].length === 0) ||
            (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
        ) {
            delete obj[key];
        }
    }
    return obj;
}

function techUpdates(oldTech, newTech, techType) {
    if (!newTech) {
        console.log(`No new ${techType} data provided.`);
        return oldTech;
    }

    if (!oldTech) {
        oldTech = {};
    }

    console.log(`Updating ${techType} fields:`);
    for (const key in newTech) {
        if (newTech.hasOwnProperty(key)) {
            const oldValue = JSON.stringify(oldTech[key]);
            const newValue = JSON.stringify(newTech[key]);
            if (oldValue !== newValue) {
                console.log(
                    `Field: ${key}, Old Value: ${oldValue}, New Value: ${newValue}`
                );
                oldTech[key] = newTech[key];
            }
        }
    }

    return removeEmptyFields(oldTech);
}

module.exports = {
    handleImageUpload,
    handleImageDeletion,
    techUpdates,
    removeEmptyFields,
};
