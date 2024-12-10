const CategoryCertificate = require("../db/categoriesCertificates.mongo");
const CertificateSchema = require("../db/certificates.mongo");
const technologiesSchema = require("../db/technologies.mongo");

async function createCertificate(certificateData) {
    try {
        const certificate = new CertificateSchema(certificateData);
        const result = await certificate.save();
        console.log("Certificate created in database");
        return { id: result.id, ...result._doc };
    } catch (err) {
        console.error(`Could not save Certificate: ${err.message}`);
        if (err.errors) {
            console.error("Validation errors:", err.errors);
        }
    }
}

async function updateCertificate(certificateData) {
    try {
        const result = await CertificateSchema.updateOne(
            { _id: certificateData.id },
            { $set: certificateData }
        );
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

async function deleteCertificate(id) {
    try {
        const result = await CertificateSchema.deleteOne({ _id: id });
        console.log("Certificate deleted from database successfully.");
        return result;
    } catch (err) {
        console.log(`Could not delete Certificate: ${err.message}`);
    }
}

async function getCertificateById(id) {
    try {
        const certificate = await CertificateSchema.findById(id);
        if (!certificate) {
            console.log(`Certificate not found with ID ${id}`);
            return null;
        }
        return certificate;
    } catch (err) {
        console.log(`Error finding Certificate with ID ${id}`);
    }
}

async function getFilteredAndSortedCertificates(category) {
    try {
        const query = category ? { category } : {};
        const certificates = await CertificateSchema.find(query).sort({
            dateFinished: -1,
        }); // Filtering by category and sorting by date
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
