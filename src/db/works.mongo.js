const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
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
        dateFinished: { type: Date },
        category: { type: String, required: true },
        client: { type: String },
        link: { type: String },
        frontTech: [{}],
        backTech: [{}],
        cardImage: imageSchema,
        images: [imageSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Works", workSchema);
