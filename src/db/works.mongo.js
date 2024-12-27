const mongoose = require("mongoose");

const techSchema = new mongoose.Schema({
    name: { type: String, required: true },
    apply: { type: Number, required: true },
});

const cardImageSchema = new mongoose.Schema(
    {
        blurHash: { type: String, required: true },
        url: { type: String, required: true },
        destination: { type: String, required: true },
        size: { type: Number, required: true },
    },
    { _id: false, default: undefined }
);

const workSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dateFinished: { type: Date, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CategoryWork",
        },
        client: { type: String, default: undefined },
        link: { type: String, default: undefined },
        frontTech: { type: Map, of: [techSchema], default: undefined },
        backTech: { type: Map, of: [techSchema], default: undefined },
        cardImage: cardImageSchema,
        slides: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Slide",
                },
            ],
            default: undefined,
        },
    },
    { timestamps: true }
);

const Work = mongoose.model("Works", workSchema);

module.exports = Work;
