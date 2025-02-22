const axios = require("axios");
const { logCompletion } = require("../../utils/logger");
const getUserData = require("../../utils/userData");
require("dotenv").config();

async function googleAuth(req, res) {
    console.log("[Google Auth] User:", req.user);
    res.status(200).json({
        message: "Success Google Auth",
        user: getUserData(req.user),
    });
    logCompletion("Google Auth");
}

async function httpAuthGitHub(req, res) {
    console.log("[GitHub Auth] User:", req.user);
    res.status(200).json({
        message: "Success GitHub Auth",
        user: getUserData(req.user),
    });
    logCompletion("GitHub Auth");
}

async function httpAuthForm(req, res) {
    console.log("[Form Auth] User:", req.user);
    res.status(200).json({
        message: "Success Form Auth",
        user: getUserData(req.user),
    });
    logCompletion("Form Auth");
}

module.exports = {
    googleAuth,
    httpAuthGitHub,
    httpAuthForm,
};
