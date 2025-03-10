const { parseDeep } = require("../../helpers/helpers");
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
    handleImageUpload,
    handleImageDeletion,
} = require("../../utils/images");
const {
    techUpdates,
    removeEmptyFields,
} = require("./works.controller.helpers");

async function httpGetFilteredAndSortedWorks(req, res) {
    const { category } = req.query;

    try {
        const works = await getFilteredAndSortedWorks(category);
        console.log(`Returned ${works.length} works`);
        res.status(200).json(works);
    } catch (err) {
        console.error("Error fetching filtered and sorted works:", err.message);
        res.status(500).json({ message: err.message });
    }
}

async function httpGetCategoriesWorks(req, res) {
    try {
        const allCategories = await getAllWorkCategories();
        console.log("Fetched all work categories");
        return res.status(200).json(allCategories);
    } catch (err) {
        console.error("Error fetching work categories:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }
}
async function httpGetTechnologies(req, res) {
    try {
        const technologies = await getTechnologies();

        if (!technologies) {
            console.error("Technologies not found");
            return res.status(500).json({
                error: `Something went wrong`,
            });
        }

        console.log("Fetched technologies");
        return res.status(200).json(technologies[0]);
    } catch (err) {
        console.error("Error fetching technologies:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }
}

async function httpCreateWork(req, res) {
    let workData = parseDeep(req.body);
    const file = req.file;

    console.log("=== Creating Work ===");
    console.log("Current work for create:", req.body);
    console.log(
        "Current image for create:",
        file ? file.originalname : "No image uploaded"
    );

    if (!workData.name || !workData.category) {
        console.info("Missing required fields");
        console.info("=== Work Creation Complete ===");
        return res.status(400).json({ message: "Missing required fields" });
    }

    let result;
    try {
        // Create work in the database first
        result = await createWork(workData);
        console.log("Create work success:", result);

        // If work creation is successful, proceed with image upload
        if (file) {
            const cardImage = await handleImageUpload({
                image: { name: workData.name },
                file,
                type: "works",
            });

            workData.cardImage = {
                blurHash: cardImage.blurHash,
                destination: cardImage.destination,
                url: cardImage.url,
                size: file.size,
            };

            // Update the work in the database with the cardImage details
            const updatedResult = await updateWork({
                ...result.toObject(),
                cardImage: workData.cardImage,
            });
            console.log("Update work with cardImage success:", updatedResult);

            console.info("=== Work Creation Complete ===");
            return res.status(201).json(updatedResult);
        }

        console.info("=== Work Creation Complete ===");
        return res.status(201).json(result);
    } catch (err) {
        console.error("Error creating work:", err.message);

        // If image upload fails, delete the created work from the database
        if (result && result._id) {
            await deleteWork(result._id);
            console.log(
                "Deleted work due to image upload failure:",
                result._id
            );
        }

        console.info("=== Work Creation Complete ===");
        return res.status(500).json({
            message: `Invalid input: ${err.message}`,
            details: err.errors,
        });
    }
}

async function httpUpdatedWork(req, res) {
    let newWork = parseDeep(req.body);
    const image = req.file;

    try {
        console.log("=== Updating Work ===");
        let oldWork = await getWorkById(newWork._id);
        if (!oldWork) {
            console.info("Work not found:", newWork._id);
            console.info("=== Work Update Complete ===");
            return res.status(404).json({ error: "Work not found" });
        }

        console.log("Old Work ID:", oldWork._id);
        console.log(
            "Old Work Data from Database:",
            JSON.stringify(oldWork, null, 2)
        );
        console.log(
            "New Work Data from Front-end:",
            JSON.stringify(newWork, null, 2)
        );
        console.log(
            "Uploaded Image:",
            image ? image.originalname : "No new image uploaded"
        );

        // Update frontTech and backTech fields
        oldWork.frontTech = techUpdates(
            oldWork.frontTech,
            newWork.frontTech,
            "frontTech"
        );
        oldWork.backTech = techUpdates(
            oldWork.backTech,
            newWork.backTech,
            "backTech"
        );

        oldWork = removeEmptyFields(oldWork);

        if (image) {
            console.log("Image has changed, updating image.");
            await handleImageDeletion(oldWork.cardImage);
            oldWork.cardImage = await handleImageUpload({
                image: { name: newWork?.name ?? oldWork.name },
                file: image,
                type: "works",
            });
            console.log("New cardImage:", oldWork.cardImage);
        } else {
            console.log("Image has not changed, skipping image update.");
        }

        // Dynamically update fields
        Object.keys(newWork).forEach((key) => {
            oldWork[key] = newWork[key];
        });

        const updatedWork = await updateWork(oldWork);
        if (!updatedWork) {
            return res.status(404).json({ error: "Work not found" });
        }

        console.log("=== Work Update Complete ===");
        return res.status(200).json(updatedWork);
    } catch (err) {
        console.error("Error updating work:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }
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

        await handleImageDeletion(work.cardImage);
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
    httpGetCategoriesWorks,
    httpCreateWork,
    httpUpdatedWork,
    httpGetTechnologies,
    httpDeleteWork,
};
