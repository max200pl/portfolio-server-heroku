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

const authRoutes = {
    google: "/google",
    form: "/form",
    github: "/github",
};

authSignUp.post(
    authRoutes.google,
    verifyIdToken,
    createJwtToken,
    createCookieSession,
    httpAuthGoogle
);

authSignUp.get(authRoutes.github, httpAuthGitHub);
authSignUp.post(authRoutes.form, httpAuthForm);

module.exports = authSignUp;
