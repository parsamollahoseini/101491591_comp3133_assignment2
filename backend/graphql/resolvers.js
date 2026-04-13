// graphql/resolvers.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
const uploadImage = require('../utils/cloudinary');
const { generateToken } = require('../utils/auth');
const {
    validateSignupInput,
    validateLoginInput
} = require('../validation/userValidation');
const { validateEmployeeInput } = require('../validation/employeeValidation');

const resolvers = {
    Query: {
        // 2. Login
        login: async (_, args) => {
            validateLoginInput(args);

            const { username, email, password } = args;

            const user = await User.findOne(
                username ? { username } : { email }
            );

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            const token = generateToken(user);

            return {
                user,
                token
            };
        },

        // 3. Get all employees
        getEmployees: async () => {
            return Employee.find();
        },

        // 5. Search employee by eid
        getEmployeeById: async (_, { eid }) => {
            const employee = await Employee.findById(eid);
            if (!employee) {
                throw new Error('Employee not found');
            }
            return employee;
        },

        // 8. Search employee by designation or department
        searchEmployee: async (_, { designation, department }) => {
            const query = {};
            if (designation) {
                query.designation = {
                    $regex: designation.trim(),
                    $options: 'i'
                };
            }
            if (department) {
                query.department = {
                    $regex: department.trim(),
                    $options: 'i'
                };
            }

            return Employee.find(query);
        }
    },

    Mutation: {
        // 1. Signup
        signup: async (_, args) => {
            validateSignupInput(args);

            const { username, email, password } = args;

            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                throw new Error('Username or email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            const savedUser = await newUser.save();
            const token = generateToken(savedUser);

            return {
                user: savedUser,
                token
            };
        },

        // 4. Add new employee (with Cloudinary upload)
        addEmployee: async (_, args, context) => {
            // Optionally require login
            if (!context.user) {
                throw new Error('Authentication required');
            }

            validateEmployeeInput(args);

            let photoUrl = null;
            if (args.employee_photo) {
                // args.employee_photo can be a base64-encoded image string
                photoUrl = await uploadImage(args.employee_photo);
            }

            const employee = new Employee({
                ...args,
                employee_photo: photoUrl
            });

            const savedEmployee = await employee.save();
            return savedEmployee;
        },

        // 6. Update employee by eid
        updateEmployee: async (_, { eid, updates }, context) => {
            if (!context.user) {
                throw new Error('Authentication required');
            }

            // If salary is provided, enforce rule >= 1000
            if (updates.salary && updates.salary < 1000) {
                throw new Error('salary must be >= 1000');
            }

            if (updates.employee_photo) {
                updates.employee_photo = await uploadImage(updates.employee_photo);
            }

            const updatedEmployee = await Employee.findByIdAndUpdate(
                eid,
                { $set: updates, updated_at: Date.now() },
                { new: true }
            );

            if (!updatedEmployee) {
                throw new Error('Employee not found');
            }

            return updatedEmployee;
        },

        // 7. Delete employee by eid
        deleteEmployee: async (_, { eid }, context) => {
            if (!context.user) {
                throw new Error('Authentication required');
            }

            const employee = await Employee.findByIdAndDelete(eid);
            if (!employee) {
                throw new Error('Employee not found');
            }

            return 'Employee deleted successfully';
        }
    }
};

module.exports = resolvers;
