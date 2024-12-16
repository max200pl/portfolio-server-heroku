const mongoose = require("mongoose");

const techSchema = new mongoose.Schema({
    name: String,
    apply: Number,
});

const imageSchema = new mongoose.Schema({
    name: String,
    blurHash: String,
    url: String,
    destination: String,
    size: Number,
});

const workSchema = new mongoose.Schema({
    name: String,
    dateFinished: Date,
    category: String,
    client: String,
    link: String,
    frontTech: {
        type: Map,
        of: [techSchema],
    },
    backTech: {
        type: Map,
        of: [techSchema],
    },
    cardImage: imageSchema,
    images: [imageSchema],
});

module.exports = mongoose.model("Works", workSchema);
