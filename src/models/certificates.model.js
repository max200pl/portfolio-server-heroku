const CertificateSchema = require("../db/certificates.mongo");
const technologiesSchema = require("../db/technologies.mongo");

async function createCertificate(Certificate) {
    try {
        const result = await CertificateSchema.create(Certificate);
        console.log("Certificate created in database");
        return result;
    } catch (err) {
        console.log(`Could not save Certificate ${err}`);
    }
}

async function updateCertificate(Certificate) {
    try {
        const result = await CertificateSchema.updateOne(
            { _id: Certificate._id },
            { $set: Certificate }
        );
        console.log("Certificate updated in database");
        return result;
    } catch (err) {
        console.log(`Could not updated Certificate ${err}`);
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

async function getAllCategories() {
    return await CertificateSchema.find({}, { category: 1, _id: 0 });
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
    getAllCategories,
    getGetFilterCertificates,
    getTechnologies,
};
