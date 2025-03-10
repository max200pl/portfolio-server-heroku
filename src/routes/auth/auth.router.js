const express = require("express");
const authLoginRouter = require("./authLogin.router");
const authLogoutRouter = require("./authLogout.router");
const authSignUpRouter = require("./authSignUp.router");
const protectedRouter = require("../protected/protected.router");
const authRouter = express.Router();

authRouter.use("/sign-up", authSignUpRouter);
authRouter.use("/login", authLoginRouter);
authRouter.use("/logout", authLogoutRouter);
authRouter.use("/profile", protectedRouter);

module.exports = {
    authRouter,
};
