const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
    {
        blurHash: { type: String },
        url: { type: String },
        destination: { type: String },
        size: { type: Number },
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
