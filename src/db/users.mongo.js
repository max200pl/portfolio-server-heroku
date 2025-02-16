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

const UserSchema = new mongoose.Schema({
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
    displayName: {
        type: String,
    },
    photoURL: {
        type: String,
    },
    providers: [ProviderSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
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
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
