const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        console.log(`File rejected: ${file.originalname}`);
        cb(new Error("Only image files are allowed"), false);
    }
};

const multerConfig = multer({
    storage: storage,
    fileFilter: fileFilter,
}).single("image"); // Ensure this matches the field name in the request

const uploadMiddleware = (req, res, next) => {
    multerConfig(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error(`Multer error: ${err.message}`);
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                console.error(
                    "Unexpected field error: Check if the field name in the request matches 'cardImage'"
                );
                return res.status(400).json({ error: "Unexpected field" });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            console.error(`Unknown error: ${err.message}`);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

module.exports = uploadMiddleware;
