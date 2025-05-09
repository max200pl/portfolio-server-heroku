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
const { parseDeep } = require("../../helpers/helpers");

async function httpGetCertificates(req, res) {
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
    let certificateData = parseDeep(req.body);
    const file = req.file;

    console.log("=== Creating Certificate ===");
    console.log("Current certificate for create:", req.body);
    console.log(
        "Current image for create:",
        file ? file.originalname : "No image uploaded"
    );

    if (!certificateData.name || !certificateData.category) {
        console.info("Missing required fields");
        console.info("=== Certificate Creation Complete ===");
        return res.status(400).json({ message: "Missing required fields" });
    }

    let result;
    try {
        // Create certificate in the database first
        result = await createCertificate(certificateData);
        console.log("Create certificate success:", result);

        // If certificate creation is successful, proceed with image upload
        if (file) {
            const cardImage = await handleImageUpload({
                image: { name: certificateData.name },
                file,
                type: "certificates",
            });

            certificateData.cardImage = {
                blurHash: cardImage.blurHash,
                destination: cardImage.destination,
                url: cardImage.url,
                size: file.size,
            };

            // Update the certificate in the database with the cardImage details
            const updatedResult = await updateCertificate({
                ...certificateData,
                _id: result._id,
            });
            console.log(
                "Update certificate with cardImage success:",
                updatedResult
            );

            console.info("=== Certificate Creation Complete ===");
            return res.status(201).json(updatedResult);
        }

        console.info("=== Certificate Creation Complete ===");
        return res.status(201).json(result);
    } catch (err) {
        console.error("Error creating certificate:", err.message);

        // If image upload fails, delete the created certificate from the database
        if (result && result._id) {
            await deleteCertificate(result._id);
            console.log(
                "Deleted certificate due to image upload failure:",
                result._id
            );
        }

        console.info("=== Certificate Creation Complete ===");
        return res.status(500).json({
            message: `Invalid input: ${err.message}`,
            details: err.errors,
        });
    }
}

async function httpUpdateCertificate(req, res) {
    let newCertificate = parseDeep(req.body);
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
            JSON.stringify(oldCertificate, null, 2)
        );
        console.log(
            "New Certificate Data from Front-end:",
            JSON.stringify(newCertificate, null, 2)
        );
        console.log(
            "Uploaded Image:",
            image ? image.originalname : "No new image uploaded"
        );

        if (image) {
            console.log("Image has changed, updating image.");
            const oldDestination = oldCertificate.cardImage?.destination;
            if (oldDestination) {
                await handleImageDeletion(oldDestination);
                console.log("Deleted old image from Firebase.");
            }

            const { blurHash, destination, url } = await handleImageUpload({
                image: { name: newCertificate.name },
                file: image,
                type: "certificates",
            });

            newCertificate.cardImage = {
                blurHash,
                destination,
                url,
                size: image.size,
            };

            console.log("Updated certificate data prepared.");
        } else {
            console.log("Image has not changed, skipping image update.");
        }

        // Dynamically update fields
        Object.keys(newCertificate).forEach((key) => {
            oldCertificate[key] = newCertificate[key];
        });

        const updatedCertificate = await updateCertificate(oldCertificate);
        if (!updatedCertificate) {
            return res.status(404).json({ error: "Certificate not found" });
        }

        console.log("=== Certificate Update Complete ===");
        return res.status(200).json(updatedCertificate);
    } catch (err) {
        console.error("Error updating certificate:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    }
}

async function httpDeleteCertificate(req, res) {
    const { certificateId } = req.query;
    console.info("=== Deleting Certificate ===");
    console.info("Current certificate for delete:", certificateId);

    try {
        const certificate = await getCertificateById(certificateId);
        if (!certificate) {
            console.info("Certificate not found:", certificateId);
            console.info("=== Certificate Deletion Complete ===");
            return res.status(404).json({ error: "Certificate not found" });
        }

        await handleImageDeletion(certificate.cardImage);
        await deleteCertificate(certificateId);
        console.info(
            `The certificate was successfully deleted: ${certificateId}`
        );
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
        .json({ message: "Certificate deleted successfully", certificateId });
}

async function httpGetCertificateById(req, res) {
    const { id } = req.params;
    console.info("=== Fetching Certificate by ID ===");
    console.info("Certificate ID:", id);

    try {
        const certificate = await getCertificateById(id);
        if (!certificate) {
            console.info("Certificate not found:", id);
            return res.status(404).json({ error: "Certificate not found" });
        }
        return res.status(200).json(certificate);
    } catch (err) {
        console.error("Error fetching certificate by ID:", err.message);
        return res.status(500).json({
            error: `Something went wrong: ${err.message}`,
        });
    } finally {
        console.info("=== Certificate Fetching by ID Complete ===");
    }
}

console.info("=== End of Certificate Controller ===");

module.exports = {
    httpGetCertificates,
    httpGetCategoriesCertificates,
    httpCreateCertificate,
    httpUpdateCertificate,
    httpDeleteCertificate,
    httpGetCertificateById,
};
