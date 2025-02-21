function getUserData(user) {
    const {
        uid,
        email,
        firstName,
        lastName,
        fullName,
        displayName,
        roles,
        settings,
    } = user;

    return {
        uid,
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
