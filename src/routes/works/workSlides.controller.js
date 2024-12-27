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

    try {
        const imageData = await handleImageUpload({
            image: { name: (await Work.findById(_id)).name },
            file: image,
            type: "works",
        });
        const slide = await createSlide(Work, _id, imageData, "works");

        console.info(
            `The slide was successfully added to work:
                name: ${slide.work.name}
                id: ${_id}
                slide: ${JSON.stringify(slide)}
            `
        );

        console.info("=== Slide Addition Complete ===");
        return res.status(200).json(slide);
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
                slide: ${JSON.stringify(slide)}
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

    try {
        const newSlideData = await handleImageUpload({
            image: { name: (await Work.findById(_id)).name },
            file: image,
            type: "works",
        });
        const slide = await updateSlideInItem(
            Work,
            _id,
            slideId,
            newSlideData,
            order,
            "work"
        );
        await handleImageDeletion(slide);

        console.info(
            `The slide was successfully updated in work:
                id: ${_id}
                slide: ${JSON.stringify(slide)}
            `
        );

        console.info("=== Slide Update Complete ===");
        return res.status(200).json(slide);
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
