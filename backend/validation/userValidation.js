// validation/userValidation.js
const validateSignupInput = (args) => {
    const errors = [];

    if (!args.username || args.username.trim() === '') {
        errors.push('Username is required');
    }
    if (!args.email || args.email.trim() === '') {
        errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(args.email)) {
        errors.push('Email is not valid');
    }
    if (!args.password || args.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateLoginInput = (args) => {
    const errors = [];
    if ((!args.username && !args.email) || (args.username === '' && args.email === '')) {
        errors.push('Username or email is required');
    }
    if (!args.password) {
        errors.push('Password is required');
    }
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

module.exports = {
    validateSignupInput,
    validateLoginInput
};