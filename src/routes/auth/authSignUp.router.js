const express = require("express");
const {
    httpGoogleAuth: httpAuthGoogle,
    httpGoogleAuthorization,
    httpAuthForm,
    httpAuthFormAuthorization: httpAuthenticationUser,
    httpAuthGitHubAuthentication,
    httpAuthGitHubAuthorization,
    httpAuthGitHub,
} = require("./auth.controller");
const verifyIdToken = require("../../middleware/verifyIdToken");
const createJwtToken = require("../../middleware/createJwtToken");
const createCookieSession = require("../../middleware/createCookieSession");
const e = require("express");

require("dotenv").config();
const authSignUp = express.Router();

authSignUp.post(
    "/google",
    verifyIdToken,
    createJwtToken,
    createCookieSession,
    httpAuthGoogle
);

authSignUp.get("/github", httpAuthGitHub);
authSignUp.post("/form", httpAuthForm);

module.exports = authSignUp;
