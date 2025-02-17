const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema({
    providerId: {
        type: String,
        required: true,
    },
    providerUid: {
        type: String,
        required: true,
    },
});

const UserSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        fullName: {
            type: String,
        },
        displayName: {
            type: String,
        },
        photoURL: {
            type: String,
        },
        providers: [ProviderSchema],
        authProvider: {
            type: String,
        },
        roles: {
            type: [String],
            default: ["user"],
        },
        settings: {
            theme: {
                type: String,
                default: "light",
            },
            language: {
                type: String,
                default: "en",
            },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);

module.exports = User;
