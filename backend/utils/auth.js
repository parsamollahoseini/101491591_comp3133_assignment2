// utils/auth.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

const getUserFromToken = (authHeader) => {
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1]; // "Bearer token"
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error('JWT verify error:', err.message);
        return null;
    }
};

module.exports = {
    generateToken,
    getUserFromToken
};