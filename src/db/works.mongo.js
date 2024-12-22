const mongoose = require("mongoose");

const techSchema = new mongoose.Schema({
    name: { type: String, required: true },
    apply: { type: Number, required: true },
});

const imageSchema = new mongoose.Schema(
    {
        blurHash: { type: String, required: true },
        url: { type: String, required: true },
        destination: { type: String, required: true },
        size: { type: Number, required: true },
    },
    { _id: false }
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
        cardImage: imageSchema,
        images: { type: [imageSchema], default: undefined },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Works", workSchema);
