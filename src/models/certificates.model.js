const CategoryCertificate = require("../db/categoriesCertificates.mongo");
const CertificateSchema = require("../db/certificates.mongo");
const technologiesSchema = require("../db/technologies.mongo");

async function createCertificate(certificateData) {
    try {
        const certificate = await CertificateSchema.create(certificateData);
        const result = await CertificateSchema.findById(
            certificate._id
        ).populate("category");
        console.log("Certificate created in database");
        return result;
    } catch (err) {
        console.error(`Could not save Certificate: ${err.message}`);
    }
}

async function updateCertificate(certificateData) {
    try {
        const result = await CertificateSchema.updateOne(
            { _id: certificateData._id },
            { $set: certificateData }
        ).populate("category");
        if (result.nModified === 0) {
            console.log(`Certificate not found with ID ${certificateData.id}`);
            return null;
        }
        console.log("Certificate updated in database");
        return { id: certificateData.id, ...certificateData };
    } catch (err) {
        console.log(`Error updating Certificate with ID ${certificateData.id}`);
    }
}

async function deleteCertificate(_id) {
    try {
        const result = await CertificateSchema.deleteOne({ _id }).populate(
            "category"
        );
        console.log("Certificate deleted from database successfully.");
        return result;
    } catch (err) {
        console.log(`Could not delete Certificate: ${err.message}`);
    }
}

async function getCertificateById(_id) {
    try {
        const certificate = await CertificateSchema.findById(_id).populate(
            "category"
        );
        if (!certificate) {
            console.log(`Certificate not found with ID ${_id}`);
            return null;
        }
        return certificate;
    } catch (err) {
        console.log(`Error finding Certificate with ID ${_id}`);
    }
}

async function getFilteredAndSortedCertificates(category) {
    try {
        const query = category ? { category } : {};
        const certificates = await CertificateSchema.find(query)
            .sort({ dateFinished: -1 }) // Filtering by category and sorting by date
            .populate("category"); // Populate the category field with the actual category data
        return certificates;
    } catch (err) {
        console.error(
            `Error fetching filtered and sorted certificates: ${err.message}`
        );
    }
}

async function getAllCertificateCategories() {
    try {
        const categories = await CategoryCertificate.find();
        if (!categories.length) {
            throw new Error("No categories found");
        }
        return categories;
    } catch (err) {
        console.error(`Error fetching categories: ${err.message}`);
    }
}

async function getTechnologies() {
    return await technologiesSchema.find(
        {},
        {
            _id: 0,
            String: 0,
        }
    );
}

module.exports = {
    getFilteredAndSortedCertificates,
    deleteCertificate,
    createCertificate,
    updateCertificate,
    getAllCertificateCategories,
    getTechnologies,
    getCertificateById,
};
