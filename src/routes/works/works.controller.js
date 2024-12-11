const { generateImageDestination } = require("../../helpers/helpers");
const {
    getTechnologies,
    createWork,
    updateWork,
    deleteWork,
    getFilteredAndSortedWorks,
    getWorkById,
    getAllWorkCategories,
} = require("../../models/works.model");
const {
    uploadImageToFirebase,
    deleteImageFromFirebase,
    getDownloadURLFromFirebase,
} = require("../../utils/firebaseStorage");
const { getCardImage } = require("../../utils/images");
const path = require("path");

async function httpGetFilteredAndSortedWorks(req, res) {
    const { category } = req.query;

    try {
        const works = await getFilteredAndSortedWorks(category);
        console.log(`Returned ${works.length} works`);
        res.status(200).json(works);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function httpGetImagesWork(req, res) {
    const { project, name } = req.query;

    console.log("Project:", project);

    const options = {
        root: path.join(__dirname, "../../images/" + project),
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true,
        },
    };

    return res.sendFile(name, options, function (err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Sent: ${project}__${name}____`);
        }
    });
}
async function httpGetCategoriesWorks(req, res) {
    try {
        const allCategories = await getAllWorkCategories();
        return res.status(200).json(allCategories);
    } catch (err) {
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }
}
async function httpGetTechnologies(req, res) {
    try {
        const technologies = await getTechnologies();

        if (!technologies) {
            return res.status(500).json({
                error: `Something went wrong`,
            });
        }

        return res.status(200).json(technologies[0]);
    } catch (err) {
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }
}

async function httpCreateWork(req, res) {
    const work = req.body;
    const image = req.file;

    if (!work || !image) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure frontTech and backTech are arrays
    work.frontTech = Array.isArray(work.frontTech) ? work.frontTech : [];
    work.backTech = Array.isArray(work.backTech) ? work.backTech : [];

    try {
        console.log("=== Creating Work ===");
        const destination = generateImageDestination("works", work.name, image);
        const cardImage = await getCardImage(work.name, image);
        await uploadImageToFirebase(image, destination);
        const imageUrl = await getDownloadURLFromFirebase(destination);

        work.cardImage = {
            name: cardImage.name,
            blurHash: cardImage.blurHash,
            destination: destination,
            url: imageUrl,
            size: image.size,
        };

        const result = await createWork(work);
        console.log("Create work success:", result);

        console.log("=== Work Creation Complete ===");
        return res.status(201).json(result);
    } catch (err) {
        console.error("Error creating work:", err.message);
        res.status(500).json({
            message: `Invalid input: ${err.message}`,
            details: err.errors,
        });
    }
}

async function httpUpdatedWork(req, res) {
    let newWork = req.body;
    const image = req.file;

    // Ensure frontTech and backTech are arrays
    newWork.frontTech = Array.isArray(newWork.frontTech)
        ? newWork.frontTech
        : [];
    newWork.backTech = Array.isArray(newWork.backTech) ? newWork.backTech : [];

    try {
        console.log("=== Updating Work ===");
        const oldWork = await getWorkById(newWork._id);
        if (!oldWork) {
            console.info("Work not found:", newWork._id);
            console.info("=== Work Update Complete ===");
            return res.status(404).json({ error: "Work not found" });
        }

        console.log("Old Work ID:", oldWork._id);
        console.log(
            "Old Work Data from Database:",
            JSON.parse(JSON.stringify(oldWork))
        ); // Convert to regular object
        console.log(
            "New Work Data from Front-end:",
            JSON.parse(JSON.stringify(newWork))
        );
        console.log(
            "Uploaded Image:",
            image ? image.originalname : "No new image uploaded"
        );

        if (image) {
            console.log("Image has changed, updating image.");
            const oldDestination = oldWork.cardImage.destination;
            const destination = generateImageDestination(
                "works",
                newWork.name,
                image
            );

            await deleteImageFromFirebase(oldDestination);
            console.log("Deleted old image from Firebase.");

            await uploadImageToFirebase(image, destination);
            console.log("Uploaded new image to Firebase.");

            const newImageUrl = await getDownloadURLFromFirebase(destination);
            console.log("New image URL from Firebase obtained.");

            const newCardImage = await getCardImage(newWork.name, image);
            console.log("New card image data obtained.");

            newWork = {
                ...newWork,
                cardImage: {
                    name: newCardImage.name,
                    blurHash: newCardImage.blurHash,
                    destination: destination,
                    url: newImageUrl,
                    size: image.size,
                },
            };

            console.log("Updated work data prepared.");
            await updateWork(newWork);
        } else {
            console.log("Image has not changed, skipping image update.");
            await updateWork({
                ...oldWork,
                ...newWork,
            });
            console.log("Work updated in database without image change.");
        }
    } catch (err) {
        console.error("Error updating work:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }

    console.log("=== Work Update Complete ===");
    return res.status(200).json(newWork);
}

async function httpDeleteWork(req, res) {
    const { _id } = req.query;
    console.info("=== Deleting Work ===");
    console.info("Current work for delete:", _id);

    try {
        const work = await getWorkById(_id);
        if (!work) {
            console.info("Work not found:", _id);
            console.info("=== Work Deletion Complete ===");
            return res.status(404).json({ error: "Work not found" });
        }

        const { cardImage } = work;
        console.log("Deleting image from Firebase:", cardImage.destination);
        await deleteImageFromFirebase(cardImage.destination);
        await deleteWork(_id);
        console.info(`The work was successfully deleted: ${_id}`);
    } catch (err) {
        console.error("Error deleting work:", err.message);
        console.info("=== Work Deletion Complete ===");
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }

    console.info("=== Work Deletion Complete ===");
    return res.status(200).json({ message: "Work deleted successfully", _id });
}
console.info("=== End of Work Controller ===");

module.exports = {
    httpGetFilteredAndSortedWorks,
    httpGetImagesWork,
    httpGetCategoriesWorks,
    httpCreateWork,
    httpUpdatedWork,
    httpGetTechnologies,
    httpDeleteWork,
};
