const {
    findExistingUser,
    updateUserFields,
    createNewUser,
} = require("../utils/userHelpers");

async function saveOrUpdateUser(req, res, next) {
    const user = req.user;

    if (!user.uid || !user.email) {
        console.error("Missing user UID or email");
        return res.status(400).json({ message: "Missing user UID or email" });
    }

    try {
        let existingUser = await findExistingUser(user.email);

        if (existingUser) {
            console.log("=== User already exists ===");
            existingUser = await updateUserFields(existingUser, user);
            req.user = existingUser;
            return next();
        }

        const newUser = await createNewUser(user);
        req.user = newUser;
        console.log(`=== User created in DB: ${newUser.uid} ===`);
        next();
    } catch (error) {
        if (error.code === 11000) {
            console.error("Duplicate key error:", error.message);
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error("Error saving or updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        console.info("=== Save or Update User Complete ===");
    }
}

module.exports = saveOrUpdateUser;
