const express = require("express");
const {
    httpGetImagesWork,
    httpGetCategoriesWorks,
    httpCreateWork, // Corrected import
    httpGetTechnologies,
    httpUpdatedWork,
    httpDeleteWork,
    httpGetFilteredAndSortedWorks,
} = require("./works.controller");
const worksRouter = express.Router();

const upload = require("../../utils/multerConfig");

worksRouter.get("/", httpGetFilteredAndSortedWorks);
worksRouter.delete("/delete", httpDeleteWork);
worksRouter.post(
    "/create",
    upload,
    (req, res, next) => {
        if (!req.body || !req.file) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpCreateWork // Corrected function name
);
worksRouter.put(
    "/update",
    upload,
    (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpUpdatedWork
);
worksRouter.get("/image", httpGetImagesWork);
worksRouter.get("/categories", httpGetCategoriesWorks);
worksRouter.get("/technologies", httpGetTechnologies);

module.exports = worksRouter;
