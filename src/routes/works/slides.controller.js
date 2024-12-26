const Slide = require("../../db/slides.mongo");
const Work = require("../../db/works.mongo");
const {
    handleImageUpload,
    handleImageDeletion,
} = require("../../utils/images");

async function httpAddSlide(req, res) {
    const { _id } = req.query;
    const image = req.file;
    console.info("=== Adding Slide to Work ===");
    console.info("Current work for slide addition:", _id);

    try {
        const work = await Work.findById(_id);
        if (!work) {
            console.info("Work not found:", _id);
            console.info("=== Slide Addition Complete ===");
            return res.status(404).json({ error: "Work not found" });
        }

        const slideData = await handleImageUpload({
            image: { name: work.name },
            file: image,
            type: "works",
        });

        // Determine the maximum order among existing slides
        const maxOrder = await Slide.find({ work: _id })
            .sort({ order: -1 })
            .limit(1)
            .then((slides) => (slides.length ? slides[0].order : 0));

        const slide = new Slide({
            ...slideData,
            work: _id,
            order: maxOrder + 1, // Set the slide order
        });

        await slide.save();
        work.slides.push(slide._id);
        await work.save();

        console.info(
            `The slide was successfully added to work:
                name: ${work.name}
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

async function httpDeleteSlide(req, res) {
    const { _id, slideId } = req.query;
    console.info("=== Deleting Slide from Work ===");
    console.info("Current work for slide deletion:", _id);

    try {
        const work = await Work.findById(_id);
        if (!work) {
            console.info("Work not found:", _id);
            console.info("=== Slide Deletion Complete ===");
            return res.status(404).json({ error: "Work not found" });
        }

        const slide = await Slide.findById(slideId);
        if (!slide) {
            console.info("Slide not found:", slideId);
            console.info("=== Slide Deletion Complete ===");
            return res.status(404).json({ error: "Slide not found" });
        }

        const slideOrder = slide.order;

        await handleImageDeletion(slide);
        await slide.remove();

        work.slides.pull(slideId);
        await work.save();

        // Update order for all subsequent slides
        await Slide.updateMany(
            { work: _id, order: { $gt: slideOrder } },
            { $inc: { order: -1 } }
        );

        console.info(
            `The slide was successfully deleted from work:
                name: ${work.name}
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

async function httpUpdateSlide(req, res) {
    const { _id, slideId } = req.query;
    const { order } = req.body;
    const image = req.file;
    console.info("=== Updating Slide in Work ===");
    console.info("Current work for slide update:", _id);

    try {
        const work = await Work.findById(_id);
        if (!work) {
            console.info("Work not found:", _id);
            console.info("=== Slide Update Complete ===");
            return res.status(404).json({ error: "Work not found" });
        }

        const slide = await Slide.findById(slideId);
        if (!slide) {
            console.info("Slide not found:", slideId);
            console.info("=== Slide Update Complete ===");
            return res.status(404).json({ error: "Slide not found" });
        }

        await handleImageDeletion(slide);

        const newSlideData = await handleImageUpload({
            image: { name: work.name },
            file: image,
            type: "works",
        });

        slide.set({
            ...newSlideData,
            order: order !== undefined ? order : slide.order, // Update order if provided
        });
        await slide.save();

        console.info(
            `The slide was successfully updated in work:
                name: ${work.name}
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

/**
 * @function httpUpdateSlidesOrder
 * @param {{
 *  body: {
 *      slides: Array<{ _id: string }>
 *  }
 * }} req - request object
 * @return {Promise}
 */
async function httpUpdateSlidesOrder(req, res) {
    const { slides } = req.body;
    console.info("=== Updating Slides Order ===");

    try {
        const bulkOps = slides.map((slide, index) => ({
            updateOne: {
                filter: { _id: slide._id },
                update: { order: index },
            },
        }));

        await Slide.bulkWrite(bulkOps); // Update slide order in a single database request (bulkWrite)

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
    httpAddSlide,
    httpDeleteSlide,
    httpUpdateSlide,
    httpUpdateSlidesOrder,
};
