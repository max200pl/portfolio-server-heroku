const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully.");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
});

async function mongoConnect() {
    console.log("=== Connecting to MongoDB ===");
    console.log("MongoDB URL:", MONGO_URL);

    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

async function mongoDisconnect() {
    console.log("=== Disconnecting from MongoDB ===");

    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully.");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
    }
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};
