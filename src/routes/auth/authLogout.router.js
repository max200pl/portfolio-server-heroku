const authLogOut = require("express").Router();

authLogOut.use((req, res, next) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    next();
});

authLogOut.post("/", (req, res) => {
    return res.status(200).json({ message: "Logout success" });
});

module.exports = authLogOut;
