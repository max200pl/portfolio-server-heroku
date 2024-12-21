const { generateImageDestination } = require("../../helpers/helpers");
const {
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getCertificateById,
    getFilteredAndSortedCertificates,
    getAllCertificateCategories,
} = require("../../models/certificates.model");
const {
    handleImageUpload,
    handleImageDeletion,
} = require("../../utils/images");

async function httpGetAllCertificates(req, res) {
    const { category } = req.query;
    console.info("=== Fetching Certificates ===");
    console.info("Category filter:", category);

    try {
        const certificates = await getFilteredAndSortedCertificates(category);
        console.info(`Returned ${certificates.length} certificates`);
        return res.status(200).json(certificates);
    } catch (err) {
        console.error("Error fetching certificates:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    } finally {
        console.info("=== Certificate Fetching Complete ===");
    }
}

async function httpGetCategoriesCertificates(req, res) {
    try {
        const categories = await getAllCertificateCategories();
        console.log(`Returned ${categories.length} categories`);
        return res.status(200).json(categories);
    } catch (err) {
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }
}

async function httpCreateCertificate(req, res) {
    const { name, dateFinished, category, link } = req.body;
    const file = req.file;

    console.log("=== Creating Certificate ===");
    console.log("Current certificate for create:", req.body);
    console.log("Current image for create:", req.file);

    if (!name || !category || !file) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const destination = generateImageDestination(
            "certificates",
            name,
            file
        );
        console.log("Current image destination for create:", destination);

        const cardImage = await handleImageUpload({ name }, file);
        delete cardImage.name; // Remove the name field

        const imageUrl = cardImage.url;

        const certificateData = {
            name,
            dateFinished,
            category,
            link,
            cardImage: {
                blurHash: cardImage.blurHash,
                destination: destination,
                url: imageUrl,
                size: file.size,
            },
        };

        console.log("Current certificate data for create:", certificateData);

        const result = await createCertificate(certificateData);
        console.log("The certificate was successfully created:", result);

        res.status(201).json(result);
    } catch (err) {
        console.error("Error creating certificate:", err.message);
        res.status(500).json({
            message: `Invalid input: ${err.message}`,
            details: err.errors,
        });
    }

    console.log("=== Certificate Creation Complete ===");
}

async function httpUpdateCertificate(req, res) {
    let newCertificate = req.body;
    const image = req.file;

    try {
        console.log("=== Updating Certificate ===");
        const oldCertificate = await getCertificateById(newCertificate._id);

        if (!oldCertificate) {
            console.info("Certificate not found:", newCertificate._id);
            console.info("=== Certificate Update Complete ===");
            return res.status(404).json({ error: "Certificate not found" });
        }

        console.log("Old Certificate ID:", oldCertificate._id);
        console.log(
            "Old Certificate Data from Database:",
            JSON.parse(JSON.stringify(oldCertificate))
        ); // Convert to regular object
        console.log(
            "New Certificate Data from Front-end:",
            JSON.parse(JSON.stringify(newCertificate))
        );
        console.log(
            "Uploaded Image:",
            image ? image.originalname : "No new image uploaded"
        );

        if (image) {
            console.log("Image has changed, updating image.");
            const oldDestination = oldCertificate.cardImage.destination;
            const destination = generateImageDestination(
                "certificates",
                newCertificate.name,
                image
            );

            await handleImageDeletion(oldDestination);
            console.log("Deleted old image from Firebase.");

            const newCardImage = await handleImageUpload(newCertificate, image);
            delete newCardImage.name; // Remove the name field

            newCertificate = {
                ...newCertificate,
                cardImage: {
                    blurHash: newCardImage.blurHash,
                    destination: destination,
                    url: newCardImage.url,
                    size: image.size,
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
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }

    console.log("=== Certificate Update Complete ===");
    return res.status(200).json(newCertificate);
}

async function httpDeleteCertificate(req, res) {
    const { _id } = req.query;
    console.info("=== Deleting Certificate ===");
    console.info("Current certificate for delete:", _id);

    try {
        const certificate = await getCertificateById(_id);
        if (!certificate) {
            console.info("Certificate not found:", _id);
            console.info("=== Certificate Deletion Complete ===");
            return res.status(404).json({ error: "Certificate not found" });
        }

        await handleImageDeletion(certificate.cardImage);
        await deleteCertificate(_id);
        console.info(`The certificate was successfully deleted: ${_id}`);
    } catch (err) {
        console.error("Error deleting certificate:", err.message);
        console.info("=== Certificate Deletion Complete ===");
        return res
            .status(500)
            .json({ error: `Something went wrong: ${err.message}` });
    }

    console.info("=== Certificate Deletion Complete ===");
    return res
        .status(200)
        .json({ message: "Certificate deleted successfully", _id });
}

console.info("=== End of Certificate Controller ===");

module.exports = {
    httpGetAllCertificates,
    httpGetCategoriesCertificates,
    httpCreateCertificate,
    httpUpdateCertificate,
    httpDeleteCertificate,
};
