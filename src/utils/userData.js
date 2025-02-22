function getUserData(user) {
    const {
        email,
        firstName,
        lastName,
        fullName,
        displayName,
        roles,
        settings,
    } = user;

    return {
        email,
        firstName,
        lastName,
        fullName,
        displayName,
        roles,
        settings,
    };
}

module.exports = getUserData;
