const mongoose = require("mongoose");

const categoryCertificateSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

const CategoryCertificate = mongoose.model(
    "CategoryCertificate",
    categoryCertificateSchema,
    "category_certificates"
);

module.exports = CategoryCertificate;
