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
        await CertificateSchema.updateOne(
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

async function getFilteredAndSortedCertificates(category) {
    try {
        const query = category ? { category } : {};
        const certificates = await CertificateSchema.find(query).sort({
            dateFinished: -1,
        }); // Фильтрация по категории и сортировка по убыванию даты
        return certificates;
    } catch (err) {
        console.error(
            `Error fetching filtered and sorted certificates: ${err.message}`
        );
        throw err;
    }
}

async function getGetFilterCertificates(category) {
    return await CertificateSchema.find(
        { category: category }, // which fields are included in the response
        {
            __v: 0,
        }
    );
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
        throw err;
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
    getGetFilterCertificates,
    getTechnologies,
    getCertificateById,
};
