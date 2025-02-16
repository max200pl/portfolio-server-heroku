const express = require("express");
const { authRouter } = require("./auth/auth.router");
const protectedRouter = require("./protected/protected.router");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/protected", protectedRouter);

module.exports = router;
