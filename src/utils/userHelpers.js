const User = require("../db/users.mongo");

async function findExistingUser(email) {
    return await User.findOne({ email });
}

async function updateUserFields(existingUser, user) {
    const updatedFields = {};
    if (user.firstName && user.firstName !== existingUser.firstName) {
        updatedFields.firstName = user.firstName;
    }
    if (user.lastName && user.lastName !== existingUser.lastName) {
        updatedFields.lastName = user.lastName;
    }
    if (user.firstName || user.lastName) {
        updatedFields.fullName = `${user.firstName || existingUser.firstName} ${
            user.lastName || existingUser.lastName
        }`;
        updatedFields.displayName = `${
            user.firstName || existingUser.firstName
        } ${user.lastName || existingUser.lastName}`;
    }

    if (Array.isArray(user.providers)) {
        const newProviders = user.providers.filter(
            (provider) =>
                !existingUser.providers.some(
                    (existingProvider) =>
                        existingProvider.providerId === provider.providerId
                )
        );
        if (newProviders.length > 0) {
            updatedFields.providers = [
                ...existingUser.providers,
                ...newProviders,
            ];
        }
    }

    if (Object.keys(updatedFields).length > 0) {
        return await User.findOneAndUpdate(
            { email: existingUser.email },
            { $set: updatedFields },
            { new: true }
        );
    }

    return existingUser;
}

async function createNewUser(user) {
    const newUser = new User({
        uid: user.uid,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fullName: `${user.firstName || ""} ${user.lastName || ""}`,
        displayName: `${user.firstName || ""} ${user.lastName || ""}`,
        authProvider: user.providers,
        providers: Array.isArray(user.providers)
            ? user.providers.map((provider) => ({
                  providerId: provider.providerId,
                  providerUid: user.uid,
              }))
            : [],
    });

    await newUser.save();
    return newUser;
}

module.exports = {
    findExistingUser,
    updateUserFields,
    createNewUser,
};
