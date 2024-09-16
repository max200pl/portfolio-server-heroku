const { Certificate, parseDeep } = require("../../helpers/helpers");
const {
    getAllCertificates,
    getAllCategories,
    getTechnologies,
    createCertificate,
    updateCertificate,
    deleteCertificate,
} = require("../../models/Certificates.model");
const { getCardImage } = require("../../utils/images");
const path = require("path");
const { sortCertificatesByDateDesc } = require("../../utils/Certificates");

async function httpGetAllCertificates(req, res) {
    let certificates = undefined;
    const { category } = req.query;
    console.log(category, "category");

    try {
        certificates = await getAllCertificates();
        // if (category) {
        //     Certificates = Certificates.filter((certificate) => certificate.category === category);
        // }
        // const sortedCertificatesByDateDesc = await sortCertificatesByDateDesc(Certificates);
        res.status(200).json(certificates);
    } catch (error) {
        res.status(400).json({
            error: `Something went wrong ${error}`,
        });
    }
}

async function httpGetImagesCertificate(req, res) {
    const { project, name } = req.query;

    const options = {
        root: path.join(__dirname, "../../images/" + project),
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true,
        },
    };

    return res.sendFile(name, options, function (err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Sent: ${project}__${name}____`);
        }
    });
}
async function httpGetCategoriesCertificates(req, res) {
    const allCategories = await getAllCategories();

    if (!allCategories)
        return res.status(400).json({
            error: `Something went wrong`,
        });

    return res.status(200).json(allCategories);
}
async function httpGetTechnologies(req, res) {
    const technologies = await getTechnologies();

    if (!technologies)
        return res.status(400).json({
            error: `Something went wrong`,
        });

    return res.status(200).json(technologies[0]);
}

async function httpCreatedCertificate(req, res) {
    const certificate = req.body;
    const image = req.file;

    if (!certificate || !image)
        return res.status(400).json({
            error: `Something went wrong`,
        });

    try {
        certificate.cardImage = await getCardImage(certificate.name, image);

        const result = await createCertificate(
            Certificate.create({ ...certificate })
        );

        console.log("Create certificate success:", result);
    } catch (err) {
        console.error(err.message);
    }

    return res.status(201).json(certificate);
}

async function httpUpdatedCertificate(req, res) {
    const certificate = parseDeep(req.body);
    const image = req.file;

    try {
        if (image) {
            certificate.cardImage = await getCardImage(certificate.name, image);
        }
        console.log("Current certificate for update:", certificate);
        const result = await updateCertificate(certificate);
        console.log("The certificate was successfully updated:", result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            error: `Something went wrong`,
        });
    }

    return res.status(201).json(certificate);
}

async function httpDeleteCertificate(req, res) {
    const { id } = req.query;

    try {
        console.log("Current ID for delete:", id);
        const result = await deleteCertificate(id);
        console.log("The certificate was successfully updated:", result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            error: `Something went wrong`,
        });
    }

    return res.status(201).json(id);
}

module.exports = {
    httpGetAllCertificates,
    httpGetImagesCertificate,
    httpGetCategoriesCertificates,
    httpCreatedCertificate,
    httpUpdatedCertificate,
    httpGetTechnologies,
    httpDeleteCertificate,
};
