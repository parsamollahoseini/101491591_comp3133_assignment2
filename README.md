# Employee Management System

COMP 3133 Full Stack Development - Assignment 2

## Overview

A full-stack web application for managing employee records with user authentication and CRUD operations. Built with Angular frontend and GraphQL backend.

## Tech Stack

**Frontend:**
- Angular 21
- TypeScript
- Reactive Forms
- Router

**Backend:**
- Node.js & Express
- GraphQL (Apollo Server)
- MongoDB Atlas
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/parsamollahoseini/101491591_comp3133_assignment2.git
cd 101491591_comp3133_assignment2
```

2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Setup Frontend
```bash
cd ../frontend
npm install
```

### Running the Application

**Start Backend:**
```bash
cd backend
npm start
```
Server runs on http://localhost:4000/graphql

**Start Frontend:**
```bash
cd frontend
npm start
```
Application runs on http://localhost:4200

## Features

- User registration and login with JWT
- View all employees in card grid layout
- Search/filter by department and position
- Add new employees with profile pictures
- Update employee information
- Delete employees
- View detailed employee profiles
- Protected routes with auth guards
- Responsive design

## Application Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   ├── graphql/         # GraphQL resolvers & typedefs
│   └── utils/           # Helper functions
└── frontend/
    └── src/
        ├── app/
        │   ├── core/           # Services, guards, models
        │   ├── features/       # Feature modules
        │   └── shared/         # Shared components
        └── styles.css
```

## Default Credentials

For testing purposes:
- Email: admin@test.com
- Password: admin123

## License

This project is for educational purposes as part of COMP 3133 coursework.
