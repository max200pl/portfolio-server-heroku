const express = require("express");
const worksRouter = require("./works/works.router");
const certificatesRouter = require("./certificates/certificates.router");
const { authRouter } = require("./auth/auth.router");
const api = express.Router();

api.use("/works", worksRouter);
api.use("/certificates", certificatesRouter);
api.use("/certificates", certificatesRouter);
api.use("/auth", authRouter);

module.exports = api;
