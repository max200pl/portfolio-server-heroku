const CategoryCertificate = require("../db/categoriesCertificates.mongo");
const CertificateSchema = require("../db/certificates.mongo");
const technologiesSchema = require("../db/technologies.mongo");

async function createCertificate(certificateData) {
    try {
        const certificate = new CertificateSchema(certificateData);
        const result = await certificate.save();
        console.log("Certificate created in database");
        return { id: result._id, ...result._doc };
    } catch (err) {
        console.error(`Could not save Certificate: ${err.message}`);
        if (err.errors) {
            console.error("Validation errors:", err.errors);
        }
        throw err;
    }
}

async function updateCertificate(certificateData) {
    try {
        const result = await CertificateSchema.updateOne(
            { _id: certificateData.id },
            { $set: certificateData }
        );
        console.log("Certificate updated in database");
        return { id: certificateData.id, ...certificateData };
    } catch (err) {
        console.log(`Could not update Certificate ${err}`);
        throw err;
    }
}

async function deleteCertificate(id) {
    try {
        const result = await CertificateSchema.deleteOne({ _id: id });
        console.log("Certificate deleted from database successfully.");
        return result;
    } catch (err) {
        console.log(`Could not deleted Certificate ${err}`);
    }
}

async function getCertificateById(id) {
    try {
        return await CertificateSchema.findById(id);
    } catch (err) {
        console.log(`Could not find Certificate ${err}`);
    }
}

async function getAllCertificates() {
    return await CertificateSchema.find(
        {},
        {
            __v: 0,
        }
    );
}

async function getGetFilterCertificates(category) {
    return await CertificateSchema.find(
        { category: category }, // which fields are included in the response
        {
            __v: 0,
        }
    );
}

async function getAllCategoryCertificates() {
    return await CategoryCertificate.find();
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
    getAllCertificates,
    deleteCertificate,
    createCertificate,
    updateCertificate,
    getAllCategoryCertificates,
    getGetFilterCertificates,
    getTechnologies,
    getCertificateById,
};
