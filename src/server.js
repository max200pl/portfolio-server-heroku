const http = require("http");
const app = require("./app.js");
const { mongoConnect } = require("./db/mongo");
const { initializeFirebaseAdmin } = require("./utils/firebaseAdmin"); // Import initialization function

const PORT = process.env.SERVER_PORT || 8000;
const server = http.createServer(app);

async function startServer() {
    await mongoConnect();

    initializeFirebaseAdmin(); // Initialize Firebase Admin SDK

    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`);
    });
}

startServer();
