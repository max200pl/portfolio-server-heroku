const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
    {
        blurHash: { type: String, required: true },
        url: { type: String, required: true },
        destination: { type: String, required: true },
        size: { type: Number, required: true },
        work: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Works",
            required: true,
        },
        order: { type: Number, default: undefined },
    },
    { timestamps: true }
);

const Slide = mongoose.model("Slide", slideSchema);

module.exports = Slide;
