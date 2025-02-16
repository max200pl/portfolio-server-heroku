const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("[MongoDB] Connection ready!");
});

mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
    console.log("[MongoDB] Connected to database.");
}

async function mongoDisconnect() {
    await mongoose.disconnect();
    console.log("[MongoDB] Disconnected from database.");
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};
