function getUserData(user) {
    const {
        email,
        firstName,
        lastName,
        fullName,
        displayName,
        roles,
        settings,
        photoURL,
    } = user;

    return {
        email,
        firstName,
        lastName,
        fullName,
        displayName,
        roles,
        settings,
        photoURL,
    };
}

module.exports = getUserData;
