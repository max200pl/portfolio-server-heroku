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
    httpAddSlideToWork,
    httpDeleteSlideFromWork,
    httpUpdateSlideToWork,
    httpUpdateSlidesOrder,
} = require("./workSlides.controller");
const verifyJwtToken = require("../../middleware/verifyJwtToken");
const checkRole = require("../../middleware/checkRole");
const worksRouter = express.Router();

const upload = require("../../utils/multerConfig");

worksRouter.get("/", verifyJwtToken, httpGetFilteredAndSortedWorks);
worksRouter.delete(
    "/delete",
    verifyJwtToken,
    checkRole("admin"),
    httpDeleteWork
);

worksRouter.post(
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
    httpCreateWork
);

worksRouter.put(
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
    httpUpdatedWork
);

worksRouter.post(
    "/add-slide",
    verifyJwtToken,
    checkRole("admin"),
    upload,
    (req, res, next) => {
        if (!req.query._id || !req.file) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpAddSlideToWork
);

worksRouter.delete(
    "/delete-slide",
    verifyJwtToken,
    checkRole("admin"),
    (req, res, next) => {
        if (!req.query.slideId) {
            return res
                .status(400)
                .json({ error: `Invalid request data ${req.query}` });
        }
        next();
    },
    httpDeleteSlideFromWork
);

worksRouter.put(
    "/update-slide",
    verifyJwtToken,
    checkRole("admin"),
    upload,
    (req, res, next) => {
        if (!req.query._id || !req.query.slideId || !req.file) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        next();
    },
    httpUpdateSlideToWork
);

worksRouter.put(
    "/slides/order",
    verifyJwtToken,
    checkRole("admin"),
    httpUpdateSlidesOrder
);

worksRouter.get(
    "/categories",
    verifyJwtToken,
    checkRole("user"),
    httpGetCategoriesWorks
);
worksRouter.get(
    "/technologies",
    verifyJwtToken,
    checkRole("user"),
    httpGetTechnologies
);

module.exports = worksRouter;
