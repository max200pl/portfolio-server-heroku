const express = require("express");
const verifyJwtToken = require("../../middleware/verifyJwtToken");
const protectedRouter = express.Router();

protectedRouter.use(verifyJwtToken);

protectedRouter.post("/", (req, res) => {
    res.status(200).json({ message: "Profile data", user: req.user });
});

module.exports = protectedRouter;
