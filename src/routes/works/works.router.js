const express = require("express");
const {
    httpGetCategoriesWorks,
    httpCreateWork,
    httpGetTechnologies,
    httpUpdatedWork,
    httpDeleteWork,
    httpGetFilteredAndSortedWorks,
} = require("./works.controller");
const {
    httpAddSlide,
    httpDeleteSlide,
    httpUpdateSlide,
    httpUpdateSlidesOrder,
} = require("./slides.controller");
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
    httpCreateWork
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

worksRouter.post(
    "/add-slide",
    upload,
    (req, res, next) => {
        if (!req.query._id || !req.file) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpAddSlide
);

worksRouter.delete(
    "/delete-slide",
    (req, res, next) => {
        if (!req.query._id || !req.query.slideId) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpDeleteSlide
);

worksRouter.put(
    "/update-slide",
    upload,
    (req, res, next) => {
        if (!req.query._id || !req.query.slideId || !req.file) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpUpdateSlide
);

worksRouter.put("/slides/order", httpUpdateSlidesOrder);

worksRouter.get("/categories", httpGetCategoriesWorks);
worksRouter.get("/technologies", httpGetTechnologies);

module.exports = worksRouter;
