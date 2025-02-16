const User = require("../db/users.mongo");

async function updateUser(user) {
    try {
        return await User.findOneAndUpdate(
            { uid: user.uid },
            { $set: { ...user, updatedAt: new Date() } },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.log(`Could not update the User: ${err}`);
    }
}

/**
 * @param {{uid?: string, email?: string}} user
 * @returns {Promise<object>}
 */
async function findUser(user) {
    try {
        return await User.findOne(
            {
                $or: [{ uid: user.uid }, { email: user.email }],
            },
            {
                projection: {
                    _id: 0,
                    __v: 0,
                },
            }
        );
    } catch (err) {
        console.log(`Could not find the User: ${err}`);
    }
}

/**
 * @description create a new user
 * @param {Object} user
 * @returns {Promise<object>}
 */
async function createUser(user) {
    try {
        return await User.create(user);
    } catch (err) {
        console.log(`Could not create a new User: ${err}`);
    }
}

module.exports = {
    updateUser,
    findUser,
    createUser,
};
