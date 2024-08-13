const express = require("express");
const cors = require("cors");
const api = require("./routes/api");
const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://maksym-poskanny-portfolio-react.onrender.com",
    "https://portfolio-server-little-lake-1018.fly.dev",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors()); // Разрешить предзапросы для всех маршрутов

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Что-то сломалось!");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parse all incoming json from the body incoming request
app.use("/api", api);

module.exports = app;
