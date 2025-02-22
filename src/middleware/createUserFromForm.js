const User = require("../db/users.mongo");

async function createUserFromForm(req, res, next) {
    const { firstName, lastName } = req.body;
    const user = req.user;

    if (!firstName || !lastName || !user.email) {
        console.error("Missing required fields");
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const existingUserByUid = await User.findOne({ uid: user.uid });

        if (existingUserByUid) {
            console.error("User already exists");
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = new User({
            uid: user.uid,
            email: user.email,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            displayName: `${firstName} ${lastName}`,
            authProvider: "form",
            providers: [{ providerId: "form", providerUid: user.uid }],
        });

        await newUser.save();
        req.user = newUser;
        console.log(`=== User created in DB: ${newUser.uid} ===`);
        next();
    } catch (error) {
        if (error.code === 11000) {
            console.error("Duplicate key error:", error.message);
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        console.info("=== User Creation from Form Complete ===");
    }
}

module.exports = createUserFromForm;
