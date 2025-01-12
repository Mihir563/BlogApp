const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
    },
    { timestamps: true } // Enable automatic createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);

module.exports = User;
