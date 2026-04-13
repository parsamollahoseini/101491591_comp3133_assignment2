// validation/employeeValidation.js
const validateEmployeeInput = (args) => {
    const errors = [];

    if (!args.first_name || args.first_name.trim() === '') {
        errors.push('first_name is required');
    }
    if (!args.last_name || args.last_name.trim() === '') {
        errors.push('last_name is required');
    }
    if (!args.email || args.email.trim() === '') {
        errors.push('email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(args.email)) {
        errors.push('email is not valid');
    }
    if (!args.gender || !['Male', 'Female', 'Other'].includes(args.gender)) {
        errors.push('gender must be Male, Female, or Other');
    }
    if (!args.designation || args.designation.trim() === '') {
        errors.push('designation is required');
    }
    if (typeof args.salary !== 'number' || args.salary < 1000) {
        errors.push('salary must be a number >= 1000');
    }
    if (!args.date_of_joining) {
        errors.push('date_of_joining is required');
    }
    if (!args.department || args.department.trim() === '') {
        errors.push('department is required');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

module.exports = {
    validateEmployeeInput
};