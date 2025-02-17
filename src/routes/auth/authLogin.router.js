const express = require("express");
const {
    httpGoogleAuth,
    httpAuthForm,
    httpAuthGitHub,
} = require("./auth.controller"); // Corrected path to auth.controller
const verifyIdToken = require("../../middleware/verifyIdToken");
const createJwtToken = require("../../middleware/createJwtToken");
const createCookieSession = require("../../middleware/createCookieSession");
const saveOrUpdateUser = require("../../middleware/saveOrUpdateUser");

require("dotenv").config();
const authLogin = express.Router();

authLogin.post(
    "/google",
    verifyIdToken,
    saveOrUpdateUser,
    createJwtToken,
    createCookieSession,
    httpGoogleAuth
);

authLogin.get("/github", httpAuthGitHub);
authLogin.post("/form", httpAuthForm);

module.exports = authLogin;
