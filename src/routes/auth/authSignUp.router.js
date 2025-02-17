const express = require("express");
const {
    httpGoogleAuth: httpAuthGoogle,
    httpAuthForm,
    httpAuthGitHub,
} = require("./auth.controller"); // Corrected path to auth.controller
const verifyIdToken = require("../../middleware/verifyIdToken");
const createJwtToken = require("../../middleware/createJwtToken");
const createCookieSession = require("../../middleware/createCookieSession");
const saveOrUpdateUser = require("../../middleware/saveOrUpdateUser");

require("dotenv").config();
const authSignUp = express.Router();

authSignUp.post(
    "/google",
    verifyIdToken,
    saveOrUpdateUser,
    createJwtToken,
    createCookieSession,
    httpAuthGoogle
);

authSignUp.get("/github", httpAuthGitHub);
authSignUp.post("/form", httpAuthForm);

module.exports = authSignUp;
