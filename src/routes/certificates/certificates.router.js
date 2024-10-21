const express = require("express");
const {
    httpGetAllCertificates,
    httpGetCategoriesCertificates,
    httpGetImagesCertificates,
    httpCreateCertificate,
    httpUpdateCertificate,
    httpDeleteCertificate,
} = require("./certificates.controller");
const certificatesRouter = express.Router();
const upload = require("../../config/multerConfig");

certificatesRouter.get("/", httpGetAllCertificates);

certificatesRouter.get(
    "/create",
    upload.single("image"),
    httpCreateCertificate
);
certificatesRouter.get("/categories", httpGetCategoriesCertificates);

certificatesRouter.delete("/delete", httpDeleteCertificate);
certificatesRouter.post(
    "/create",
    upload.single("image"),
    httpCreateCertificate
);

certificatesRouter.put(
    "/update",
    upload.single("image"),
    httpUpdateCertificate
);

// certificatesRouter.get("/image", httpGetImagesCertificates);

module.exports = certificatesRouter;
