const express = require("express");
const multerConfig = require("../../utils/multerConfig");
const {
    httpCreateCertificate,
    httpGetAllCertificates,
    httpGetCategoriesCertificates,
    httpDeleteCertificate,
    httpUpdateCertificate,
    httpGetCertificateById,
} = require("./certificates.controller");

const router = express.Router();

router.post(
    "/create",
    multerConfig,
    (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpCreateCertificate
);

router.get("/", httpGetAllCertificates);
router.get("/categories", httpGetCategoriesCertificates);
router.get("/:id", httpGetCertificateById);
router.delete("/delete", httpDeleteCertificate);

router.put(
    "/update",
    multerConfig,
    (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpUpdateCertificate
);

module.exports = router;
