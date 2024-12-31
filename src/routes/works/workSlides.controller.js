const {
    createSlide,
    deleteSlideFromItem,
    updateSlideInItem,
    updateSlidesOrder,
} = require("../../models/slide.model");
const {
    handleImageUpload,
    handleImageDeletion,
} = require("../../utils/images");
const Work = require("../../db/works.mongo");

async function httpAddSlideToWork(req, res) {
    const { _id } = req.query;
    const image = req.file;
    console.info("=== Adding Slide to Work ===");
    console.info("Current work for slide addition:", _id);
    console.info(
        "Current image for slide addition:",
        image ? image.originalname : "No image uploaded"
    );

    try {
        const work = await Work.findById(_id);
        if (!work) {
            throw new Error("Work not found");
        }

        const newSlide = await createSlide(Work, _id, {}, "works");
        console.log("Create slide success:", newSlide);

        if (image) {
            try {
                const slideImage = await handleImageUpload({
                    image: {
                        name: `${work.name}/slideId_${newSlide._id.toString()}`,
                    },
                    file: image,
                    type: "works",
                });

                newSlide.set({
                    blurHash: slideImage.blurHash,
                    destination: slideImage.destination,
                    url: slideImage.url,
                    size: image.size,
                });

                await newSlide.save();
                console.log(
                    "Slide created and image uploaded successfully:",
                    newSlide
                );
            } catch (err) {
                await deleteSlideFromItem(Work, _id, newSlide._id, "works");
                console.error(
                    "Error uploading image, slide deleted:",
                    err.message
                );
                return res
                    .status(500)
                    .json({ message: `Image upload failed: ${err.message}` });
            }
        }

        console.info("=== Slide Addition Complete ===");
        return res.status(201).json(newSlide);
    } catch (err) {
        console.error("Error adding slide to work:", err.message);
        console.info("=== Slide Addition Complete ===");
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }
}

async function httpDeleteSlideFromWork(req, res) {
    const { _id, slideId } = req.query;
    console.info("=== Deleting Slide from Work ===");
    console.info("Current work for slide deletion:", _id);

    try {
        const slide = await deleteSlideFromItem(Work, _id, slideId, "work");
        await handleImageDeletion(slide);

        console.info(
            `The slide was successfully deleted from work:
                id: ${_id}
                slide: ${JSON.stringify(slide, null, 2)}
            `
        );

        console.info("=== Slide Deletion Complete ===");
        return res.status(200).json(slide);
    } catch (err) {
        console.error("Error deleting slide from work:", err.message);
        console.info("=== Slide Deletion Complete ===");
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }
}

async function httpUpdateSlideToWork(req, res) {
    const { _id, slideId } = req.query;
    const { order } = req.body;
    const image = req.file;
    console.info("=== Updating Slide in Work ===");
    console.info("Current work for slide update:", _id);
    console.info(
        "Current image for slide update:",
        image ? image.originalname : "No image uploaded"
    );

    try {
        const work = await Work.findById(_id);
        if (!work) {
            throw new Error("Work not found");
        }

        const updatedSlide = await updateSlideInItem(
            Work,
            _id,
            slideId,
            {},
            order,
            "works"
        );
        console.log("Update slide success:", updatedSlide);

        if (image) {
            try {
                const slideImage = await handleImageUpload({
                    image: { name: work.name },
                    file: image,
                    type: "slides",
                });

                updatedSlide.set({
                    blurHash: slideImage.blurHash,
                    destination: slideImage.destination,
                    url: slideImage.url,
                    size: image.size,
                });

                await updatedSlide.save();
                console.log(
                    "Slide updated and image uploaded successfully:",
                    updatedSlide
                );
            } catch (err) {
                await deleteSlideFromItem(Work, _id, updatedSlide._id, "works");
                console.error(
                    "Error uploading image, slide deleted:",
                    err.message
                );
                return res
                    .status(500)
                    .json({ message: `Image upload failed: ${err.message}` });
            }
        }

        console.info("=== Slide Update Complete ===");
        return res.status(200).json(updatedSlide);
    } catch (err) {
        console.error("Error updating slide in work:", err.message);
        console.info("=== Slide Update Complete ===");
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }
}

async function httpUpdateSlidesOrder(req, res) {
    const { slides } = req.body;
    console.info("=== Updating Slides Order ===");

    try {
        await updateSlidesOrder(slides);

        console.info("=== Slides Order Update Complete ===");
        return res
            .status(200)
            .json({ message: "Slides order updated successfully" });
    } catch (err) {
        console.error("Error updating slides order:", err.message);
        console.info("=== Slides Order Update Complete ===");
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }
}

module.exports = {
    httpAddSlideToWork,
    httpDeleteSlideFromWork,
    httpUpdateSlideToWork,
    httpUpdateSlidesOrder,
};
