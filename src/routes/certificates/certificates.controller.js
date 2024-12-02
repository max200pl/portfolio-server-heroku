const { Certificate, parseDeep } = require("../../helpers/helpers");
const {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getAllCategoryCertificates,
} = require("../../models/certificates.model");
const { uploadImageToFirebase } = require("../../utils/firebaseStorage");
const { getCardImage } = require("../../utils/images");
const path = require("path");

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
    try {
        const allCategories = await getAllCategoryCertificates();

        if (!allCategories) {
            return res.status(400).json({
                error: `No categories found`,
            });
        }

        res.status(200).json(allCategories);
    } catch (error) {
        return res.status(400).json({
            error: `Something went wrong`,
        });
    }
}

async function httpCreateCertificate(req, res) {
    const { name, dateFinished, category, link } = req.body;
    const file = req.file;

    console.log("Current certificate for create:", req.body);
    console.log("Current image for create:", req.file);

    if (!name || !category || !file) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const cardImage = await getCardImage(name, file);

        console.log("Current card image for create:", cardImage);

        const imageUrl = await uploadImageToFirebase(file);

        console.log("Current image URL for create:", imageUrl);

        const certificateData = {
            name,
            dateFinished,
            category,
            link,
            cardImage: {
                name: cardImage.name,
                blurHash: cardImage.blurHash,
                url: imageUrl,
            },
        };

        console.log("Current certificate data for create:", certificateData);

        const result = await createCertificate(certificateData);

        console.log("The certificate was successfully created:", result);

        res.status(201).json({ id: result.id, ...result });
    } catch (err) {
        console.error("Error creating certificate:", err.message);
        res.status(500).json({
            message: `Invalid input: ${err.message}`,
            details: err.errors,
        });
    }
}

async function httpUpdateCertificate(req, res) {
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

    return res.status(200).json(certificate);
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

    return res.status(200).json(id);
}

async function httpGetImagesCertificate(req, res) {
    const { project, name } = req.query;

    console.log("Project:", project);

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

module.exports = {
    httpGetAllCertificates,
    httpGetImagesCertificate,
    httpGetCategoriesCertificates,
    httpCreateCertificate,
    httpUpdateCertificate,
    httpDeleteCertificate,
};
