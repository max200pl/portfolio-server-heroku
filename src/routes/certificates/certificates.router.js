const express = require("express");
const {
    httpGetCertificates,
    httpCreateCertificate,
    httpUpdateCertificate,
    httpDeleteCertificate,
    httpGetCategoriesCertificates,
    httpGetCertificateById,
} = require("./certificates.controller");
const verifyJwtToken = require("../../middleware/verifyJwtToken");
const checkRole = require("../../middleware/checkRole");
const upload = require("../../utils/multerConfig");

const certificatesRouter = express.Router();

certificatesRouter.get("/", verifyJwtToken, httpGetCertificates);

certificatesRouter.get("/categories", httpGetCategoriesCertificates);
certificatesRouter.get("/:id", httpGetCertificateById);

certificatesRouter.post(
    "/create",
    verifyJwtToken,
    checkRole("admin"),
    upload,
    (req, res, next) => {
        if (!req.body) {
            console.error("Invalid request data");
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpCreateCertificate
);

certificatesRouter.put(
    "/update",
    verifyJwtToken,
    checkRole("admin"),
    upload,
    (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpUpdateCertificate
);

certificatesRouter.delete(
    "/delete",
    verifyJwtToken,
    checkRole("admin"),
    (req, res, next) => {
        if (!req.query.certificateId) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpDeleteCertificate
);

module.exports = certificatesRouter;
