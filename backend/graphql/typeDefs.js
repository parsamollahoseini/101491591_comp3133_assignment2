// graphql/typeDefs.js
const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        _id: ID
        username: String
        email: String
        created_at: String
        updated_at: String
    }

    type Employee {
        _id: ID
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: String
        department: String
        employee_photo: String
        created_at: String
        updated_at: String
    }

    type AuthPayload {
        user: User
        token: String
    }

    type Query {
        # 2. Login
        login(username: String, email: String, password: String!): AuthPayload

        # 3. Get all employees
        getEmployees: [Employee]

        # 5. Search employee by eid
        getEmployeeById(eid: ID!): Employee

        # 8. Search employee by designation or department
        searchEmployee(designation: String, department: String): [Employee]
    }

    input EmployeeUpdateInput {
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: String
        department: String
        employee_photo: String
    }

    type Mutation {
        # 1. Signup
        signup(username: String!, email: String!, password: String!): AuthPayload

        # 4. Add new employee
        addEmployee(
            first_name: String!,
            last_name: String!,
            email: String!,
            gender: String!,
            designation: String!,
            salary: Float!,
            date_of_joining: String!,
            department: String!,
            employee_photo: String
        ): Employee

        # 6. Update employee by eid
        updateEmployee(eid: ID!, updates: EmployeeUpdateInput!): Employee

        # 7. Delete employee by eid
        deleteEmployee(eid: ID!): String
    }
`;