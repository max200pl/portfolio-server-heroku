const express = require("express");
const multerConfig = require("../../utils/multerConfig");
const {
    httpCreateCertificate,
    httpGetAllCertificates,
    httpGetCategoriesCertificates,
    httpDeleteCertificate,
    httpUpdateCertificate,
    httpGetImagesCertificate,
} = require("./certificates.controller");

const router = express.Router();

router.post(
    "/create",
    multerConfig,
    (req, res, next) => {
        if (!req.body || !req.file) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpCreateCertificate
);

router.get("/", httpGetAllCertificates);
router.get("/categories", httpGetCategoriesCertificates);
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

router.get("/image", httpGetImagesCertificate);

module.exports = router;
