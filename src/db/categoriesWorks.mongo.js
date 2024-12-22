const mongoose = require("mongoose");

const categoryWorkSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
    },
    { timestamps: true }
);

const CategoryWork = mongoose.model(
    "CategoryWork",
    categoryWorkSchema,
    "category_works"
);

module.exports = CategoryWork;
