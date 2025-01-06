const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
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
        dateFinished: { type: Date, required: false },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CategoryCertificate",
        },
        cardImage: { type: imageSchema, required: false },
        link: { type: String, required: false },
    },
    { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
