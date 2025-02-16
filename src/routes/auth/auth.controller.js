const axios = require("axios");
const { logCompletion } = require("../../utils/logger");
require("dotenv").config();

async function httpGoogleAuthorization(codeResponse) {
    console.log("=== Google Authorization ===");
    console.log("Code Response:", codeResponse);

    try {
        const response = await axios({
            url: "https://www.googleapis.com/oauth2/v1/userinfo",
            method: "get",
            arguments: { access_token: codeResponse.access_token },
            headers: {
                Authorization: `Bearer ${codeResponse.access_token}`,
                Accept: "application/json",
            },
        });

        console.log("Google Authorization successful:", response.data);
        logCompletion("Google Authorization");
        return response.data;
    } catch (error) {
        console.error("Error during Google authorization:", error.message);
        logCompletion("Google Authorization");
        return error;
    }
}

async function httpAuthGitHubAuthentication(codeResponse) {
    console.log("=== GitHub Authentication ===");
    console.log("Code Response:", codeResponse);

    try {
        const response = await axios({
            url: "https://github.com/login/oauth/access_token",
            method: "post",
            data: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: codeResponse.code,
            },
            headers: {
                Authorization: `Bearer ${codeResponse.code}`,
                Accept: "application/json",
            },
        });

        console.info("GitHub Authentication successful:", response.statusText);
        logCompletion("GitHub Authentication");
        return response.data;
    } catch (error) {
        console.error("Error during GitHub authentication:", error.message);
        logCompletion("GitHub Authentication");
        return error;
    }
}

async function httpAuthGitHubAuthorization(codeResponse) {
    console.log("=== GitHub Authorization ===");
    console.log("Code Response:", codeResponse);

    try {
        const response = await axios({
            url: "https://api.github.com/user",
            method: "get",
            headers: {
                Authorization: `Bearer ${codeResponse.access_token}`,
            },
        });

        console.log("GitHub Authorization successful:", response.data);
        logCompletion("GitHub Authorization");
        return response.data;
    } catch (error) {
        console.error("Error during GitHub authorization:", error.message);
        logCompletion("GitHub Authorization");
        return error;
    }
}

async function httpGoogleAuth(req, res) {
    console.log("=== Google Auth ===");
    console.log("Session User:", req.session.user);

    res.status(200).json({
        message: "Success Google Auth",
        user: req.session.user,
    });
    logCompletion("Google Auth");
}

async function httpAuthGitHub(req, res) {
    console.log("=== GitHub Auth ===");
    console.log("Session User:", req.session.user);

    res.status(200).json({
        message: "Success GitHub Auth",
        user: req.session.user,
    });
    logCompletion("GitHub Auth");
}

async function httpAuthForm(req, res) {
    console.log("=== Form Auth ===");
    console.log("Session User:", req.session.user);

    res.status(200).json({
        message: "Success Form Auth",
        user: req.session.user,
    });
    logCompletion("Form Auth");
}

module.exports = {
    httpGoogleAuth,
    httpAuthGitHub,
    httpAuthForm,
    httpGoogleAuthorization,
    httpAuthGitHubAuthorization,
    httpAuthGitHubAuthentication,
};
