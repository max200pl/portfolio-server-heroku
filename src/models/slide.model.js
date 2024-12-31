const Slide = require("../db/slides.mongo");

/**
 *
 * @param {*} model
 * @param {*} itemId
 * @param {*} imageData
 * @param {*} type
 * @returns {Promise<Slide>}
 */
async function createSlide(model, itemId, imageData, type) {
    try {
        const item = await model.findById(itemId);
        if (!item) {
            throw new Error(`${type} not found`);
        }

        // Initialize slides array if it doesn't exist
        if (!item.slides) {
            item.slides = [];
        }

        // Determine the maximum order among existing items
        const maxOrder = await Slide.find({ work: itemId })
            .sort({ order: -1 })
            .limit(1)
            .then((items) => (items.length ? items[0].order : 0));

        const newItem = new Slide({
            ...imageData,
            work: itemId,
            order: maxOrder + 1, // Set the item order
        });

        await newItem.save();
        item.slides.push(newItem._id);
        await item.save();

        return newItem;
    } catch (err) {
        console.error(`Error creating slide: ${err.message}`);
        throw err;
    }
}

async function deleteSlideFromItem(model, itemId, slideId, type) {
    try {
        if (!slideId) {
            throw new Error("Slide ID not provided");
        }

        const slide = await Slide.findById(slideId);
        if (!slide) {
            throw new Error("Slide not found");
        }

        if (itemId) {
            const item = await model.findById(itemId);
            if (!item) {
                throw new Error(`${type} not found`);
            }

            const slideOrder = slide.order;
            await slide.deleteOne();
            item.slides.pull(slideId);
            await item.save();

            // Update order for all subsequent slides
            await Slide.updateMany(
                { work: itemId, order: { $gt: slideOrder } },
                { $inc: { order: -1 } }
            );
        } else {
            await slide.deleteOne();
        }

        return slide;
    } catch (err) {
        console.error(`Error deleting slide: ${err.message}`);
        throw err;
    }
}

async function updateSlideInItem(
    model,
    itemId,
    slideId,
    newSlideData,
    order,
    type
) {
    try {
        if (!slideId) {
            throw new Error("Slide ID not provided");
        }

        const slide = await Slide.findById(slideId);
        if (!slide) {
            throw new Error("Slide not found");
        }

        if (itemId) {
            const item = await model.findById(itemId);
            if (!item) {
                throw new Error(`${type} not found`);
            }
        }

        slide.set({
            ...newSlideData,
            order: order !== undefined ? order : slide.order, // Update order if provided
        });
        await slide.save();

        return slide;
    } catch (err) {
        console.error(`Error updating slide: ${err.message}`);
        throw err;
    }
}

async function updateSlidesOrder(slides) {
    try {
        const bulkOps = slides.map((slide, index) => ({
            updateOne: {
                filter: { _id: slide._id },
                update: { order: index },
            },
        }));

        await Slide.bulkWrite(bulkOps); // Update slide order in a single database request (bulkWrite)
    } catch (err) {
        console.error(`Error updating slides order: ${err.message}`);
        throw err;
    }
}

module.exports = {
    Slide,
    createSlide,
    deleteSlideFromItem,
    updateSlideInItem,
    updateSlidesOrder,
};
