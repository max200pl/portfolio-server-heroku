const { generateImageDestination } = require("../../helpers/helpers");
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
                size: file.size, // Add size property
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
        const oldCertificate = await getCertificateById(newCertificate.id);
        console.log("=== Updating Certificate ===");
        console.log(
            "Old Certificate:",
            JSON.stringify(oldCertificate, null, 2)
        );
        console.log(
            "New Certificate Data:",
            JSON.stringify(newCertificate, null, 2)
        );
        console.log(
            "Uploaded Image:",
            image ? image.originalname : "No new image uploaded"
        );

        if (image) {
            console.log("Image has changed, updating image.");
            const oldDestination = oldCertificate.cardImage.destination;
            const destination = generateImageDestination(
                newCertificate.name,
                image
            );

            await deleteImageFromFirebase(oldDestination);
            console.log("Deleted old image from Firebase.");

            await uploadImageToFirebase(image, destination);
            console.log("Uploaded new image to Firebase.");

            const newImageUrl = await getDownloadURLFromFirebase(destination);
            console.log("New image URL from Firebase obtained.");

            const newCardImage = await getCardImage(newCertificate.name, image);
            console.log("New card image data obtained.");

            newCertificate = {
                ...newCertificate,
                cardImage: {
                    name: newCardImage.name,
                    blurHash: newCardImage.blurHash,
                    destination: destination,
                    url: newImageUrl,
                    size: image.size, // Add size property
                },
            };

            console.log("Updated certificate data prepared.");
            await updateCertificate(newCertificate);
        } else {
            console.log("Image has not changed, skipping image update.");
            await updateCertificate({
                ...oldCertificate,
                ...newCertificate,
            });
            console.log(
                "Certificate updated in database without image change."
            );
        }
    } catch (err) {
        console.error("Error updating certificate:", err.message);
        return res.status(400).json({
            error: `Something went wrong: ${err.message}`,
        });
    }

    console.log("=== Certificate Update Complete ===");
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
