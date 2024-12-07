const { parseDeep } = require("../../helpers/helpers");
const {
    getAllCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getAllCategoryCertificates,
    getCertificateById,
} = require("../../models/certificates.model");
const {
    uploadImageToFirebase,
    deleteImageFromFirebase,
    getDownloadURLFromFirebase,
} = require("../../utils/firebaseStorage");
const { getCardImage } = require("../../utils/images");
const path = require("path");
const { generateImageDestination } = require("../../helpers/helpers");

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
        const destination = generateImageDestination(name, file);
        console.log("Current image destination for create:", destination);

        const cardImage = await getCardImage(name, file);

        await uploadImageToFirebase(file, destination);

        const imageUrl = await getDownloadURLFromFirebase(destination);

        const certificateData = {
            name,
            dateFinished,
            category,
            link,
            cardImage: {
                name: cardImage.name,
                blurHash: cardImage.blurHash,
                destination: destination,
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
    let newCertificate = req.body;
    const image = req.file;

    try {
        //1 - get certificate by id
        const oldCertificate = await getCertificateById(newCertificate.id);

        const oldDestination = oldCertificate.cardImage.destination;

        if (image) {
            const destination = generateImageDestination(
                newCertificate.name,
                image
            );
            const newImageUrl = await getDownloadURLFromFirebase(destination);
            const newCardImage = await getCardImage(newCertificate.name, image);

            //2 - delete old image from firebase
            await deleteImageFromFirebase(oldDestination);
            //3 - upload new image to firebase
            await uploadImageToFirebase(image, destination);

            //4 - update certificate with new image details
            newCertificate = {
                ...newCertificate,
                cardImage: {
                    name: newCardImage.name,
                    blurHash: newCardImage.blurHash,
                    destination: destination,
                    url: newImageUrl,
                },
            };

            console.log("Current certificate for update:", newCertificate);
        }

        //6 - update certificate
        console.log("Current certificate for update:", newCertificate);
        const result = await updateCertificate(oldCertificate);
        console.log(
            "The certificate was successfully updated:",
            oldCertificate
        );
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            error: `Something went wrong`,
        });
    }

    return res.status(200).json(newCertificate);
}

async function httpDeleteCertificate(req, res) {
    const { id } = req.query;
    console.info("Current certificate for delete:", id);

    try {
        const { cardImage } = await getCertificateById(id);

        await deleteImageFromFirebase(cardImage.destination);

        const result = await deleteCertificate(id); // Define the result variable

        console.info(`
            The certificate was successfully deleted: ${id}
        `);
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
