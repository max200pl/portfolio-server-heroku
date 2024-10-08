const express = require("express");
const {
    httpGetAllCertificates,
    httpGetImagesCertificates,
    httpCreateCertificate,
    httpUpdatedCertificates,
    httpDeleteCertificates,
} = require("./certificates.controller");
const certificatesRouter = express.Router();
const upload = require("../../config/multerConfig");

certificatesRouter.get("/", httpGetAllCertificates);

// certificatesRouter.delete("/delete", httpDeleteCertificates);
certificatesRouter.post(
    "/create",
    upload.single("image"),
    httpCreateCertificate
);
// certificatesRouter.put(
//     "/update",
//     upload.single("image"),
//     httpUpdatedCertificates
// );
// certificatesRouter.get("/image", httpGetImagesCertificates);

module.exports = certificatesRouter;
