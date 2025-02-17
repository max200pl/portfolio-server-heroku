const User = require("../db/users.mongo");

async function saveOrUpdateUser(req, res, next) {
    const user = req.user;

    if (!user) {
        console.error("User data is missing");
        return res.status(400).json({ message: "User data is missing" });
    }

    try {
        const existingUser = await User.findOne({ uid: user.uid });

        if (existingUser) {
            existingUser.email = user.email;
            existingUser.displayName = user.displayName;
            existingUser.photoURL = user.photoURL;
            existingUser.providers = user.providers;
            existingUser.authProvider = user.authProvider;
            await existingUser.save();
        } else {
            let firstName = user.firstName || "";
            let lastName = user.lastName || "";
            let fullName = user.fullName || user.displayName;
            if (!firstName && !lastName && user.displayName) {
                const [first, ...lastParts] = user.displayName.split(" ");
                firstName = first;
                lastName = lastParts.join(" ");
            }

            const newUser = new User({
                uid: user.uid,
                email: user.email,
                firstName,
                lastName,
                fullName,
                displayName: user.displayName,
                photoURL: user.photoURL,
                providers: [
                    { providerId: user.providers, providerUid: user.uid },
                ],
                authProvider: user.authProvider,
            });
            await newUser.save();
        }

        next();
    } catch (error) {
        console.error("Error saving or updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        console.info("=== Save or Update User Complete ===");
    }
}

module.exports = saveOrUpdateUser;
