const express = require("express");
const cors = require("cors");
const api = require("./routes/api");
const app = express();

const allowedOrigins = [
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
        allowedHeaders: "*",
        credentials: true,
    })
);

app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", api);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Что-то сломалось!");
});

module.exports = app;
