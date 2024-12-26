const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: false,
        },
        work: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Work",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Slide = mongoose.model("Slide", SlideSchema);

async function createSlide(slide) {
    try {
        const result = await Slide.create(slide);
        console.log("Slide created in database");
        return result;
    } catch (err) {
        console.log(`Could not save slide ${err}`);
    }
}

async function updateSlide(slideId, slide) {
    try {
        const result = await Slide.findByIdAndUpdate(
            slideId,
            { $set: slide },
            { new: true, useFindAndModify: false }
        );
        if (!result) {
            console.log(`Slide not found with ID ${slideId}`);
            return null;
        }
        console.log("Slide updated in database");
        return result;
    } catch (err) {
        console.log(`Error updating Slide with ID ${slideId}: ${err}`);
    }
}

async function deleteSlide(slideId) {
    try {
        const result = await Slide.findByIdAndDelete(slideId);
        if (!result) {
            console.log(`Slide not found with ID ${slideId}`);
            return null;
        }
        console.log("Slide deleted from database");
        return result;
    } catch (err) {
        console.log(`Error deleting Slide with ID ${slideId}: ${err}`);
    }
}

module.exports = {
    createSlide,
    updateSlide,
    deleteSlide,
    Slide,
};
