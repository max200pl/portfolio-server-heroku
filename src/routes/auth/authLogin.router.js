const express = require("express");
const {
    httpGoogleAuth,
    httpAuthForm,
    httpAuthGitHub,
} = require("./auth.controller"); // Ensure these functions are correctly imported
const verifyIdToken = require("../../middleware/verifyIdToken");
const createJwtToken = require("../../middleware/createJwtToken");
const createCookieSession = require("../../middleware/createCookieSession");
const saveOrUpdateUser = require("../../middleware/saveOrUpdateUser");
const createUserFromForm = require("../../middleware/createUserFromForm");

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

authLogin.post(
    "/form",
    verifyIdToken,
    createUserFromForm,
    createJwtToken,
    createCookieSession,
    httpAuthForm
);

authLogin.get("/github", httpAuthGitHub);

module.exports = authLogin;
