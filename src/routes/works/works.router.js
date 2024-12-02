const express = require("express");
const {
    httpGetAllWorks,
    httpGetImagesWork,
    httpGetCategoriesWorks,
    httpCreatedWork: httpCreateWork,
    httpGetTechnologies,
    httpUpdatedWork,
    httpDeleteWork,
} = require("./works.controller");
const worksRouter = express.Router();

const upload = require("../../utils/multerConfig");

worksRouter.get("/", httpGetAllWorks);
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
    httpCreateWork
);
worksRouter.put(
    "/update",
    upload,
    (req, res, next) => {
        if (!req.body || !req.file) {
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
