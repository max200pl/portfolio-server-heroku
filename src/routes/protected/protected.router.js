const express = require("express");
const verifyJwtToken = require("../../middleware/verifyJwtToken");
const protectedRouter = express.Router();

protectedRouter.use(verifyJwtToken);

protectedRouter.get("/profile", (req, res) => {
    res.status(200).json({ message: "Profile data", user: req.user });
});

module.exports = protectedRouter;
