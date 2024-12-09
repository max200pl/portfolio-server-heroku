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

const certificateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dateFinished: { type: Date },
        category: { type: String, required: true },
        cardImage: imageSchema,
        link: { type: String },
    },
    { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
