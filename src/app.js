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

// Middleware для логирования входящих запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    next();
});

// Middleware для проверки заголовков запроса
app.use((req, res, next) => {
    const expectedHeaders = {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en,en-US;q=0.8,ru;q=0.5,ru-RU;q=0.3",
        connection: "keep-alive",
        host: "portfolio-server-little-lake-1018.fly.dev",
        priority: "u=0, i",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        "upgrade-insecure-requests": "1",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
    };

    for (const [key, value] of Object.entries(expectedHeaders)) {
        if (req.headers[key] !== value) {
            return res.status(400).send(`Invalid header: ${key}`);
        }
    }
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Что-то сломалось!");
});

app.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});
