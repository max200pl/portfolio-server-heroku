const authLogOut = require("express").Router();

authLogOut.use((req, res, next) => {
    console.log("=== Logging Out ===");
    console.log("Node Environment:", process.env.NODE_ENV);

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Protect against CSRF attacks
        path: "/", // Make cookie accessible on all routes
        secure: process.env.NODE_ENV === "production",
    });

    console.log("JWT cookie cleared successfully");
    next();
});

authLogOut.post("/", (req, res) => {
    return res.status(200).json({ message: "Logout success" });
});

module.exports = authLogOut;
