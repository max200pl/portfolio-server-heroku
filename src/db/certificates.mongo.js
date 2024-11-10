const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        blurHash: { type: String, required: true },
    },
    { _id: false }
);

const certificateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dateFinished: { type: Date },
        category: {
            type: {
                _id: { type: String, required: true },
                type_name: { type: String, required: true },
                description: { type: String },
            },
            required: true,
        },
        link: { type: String },
        cardImage: imageSchema,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Certificates", certificateSchema);
