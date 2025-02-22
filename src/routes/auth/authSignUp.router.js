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
const createUserFromForm = require("../../middleware/createUserFromForm");

require("dotenv").config();
const authSignUp = express.Router();

authSignUp.post(
    "/google",
    verifyIdToken,
    saveOrUpdateUser,
    createJwtToken,
    createCookieSession,
    httpGoogleAuth
);

authSignUp.post(
    "/github",
    verifyIdToken,
    saveOrUpdateUser,
    createJwtToken,
    createCookieSession,
    httpAuthGitHub
);

authSignUp.post(
    "/form",
    verifyIdToken,
    createUserFromForm,
    createJwtToken,
    createCookieSession,
    httpAuthForm
);

module.exports = authSignUp;
