const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY || 'secretkey';

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.methods.generateAuthToken = function () {
    // Generate an auth token for the user
    // Can turn on expiry using { expiresIn: 604800 }
    const user = this;
    const token = jwt.sign({ user }, secretKey);
    return token;
}

module.exports = mongoose.model('Users', UserSchema);
