const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const api = require("./routes/api");
const app = express();

const allowedOrigins = [
    "https://portfolio-react-5b7d3.web.app",
    "http://localhost:3000",
    "https://maksym-poskanny-portfolio-react.onrender.com",
];

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    // console.log("Headers:", req.headers);
    next();
});

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser([process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2]));
app.use("/api", api);

console.log("Node Environment:", process.env.NODE_ENV);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Что-то сломалось!");
});

module.exports = app;
