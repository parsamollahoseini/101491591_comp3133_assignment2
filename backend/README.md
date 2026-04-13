# COMP3133 – Assignment 1
Student ID: 101505276

Author: Kevin George Buhain

## Project Overview

This project is a GraphQL API built using Node.js, Express, Apollo Server, and MongoDB Atlas, with support for:

JWT Authentication

Employee CRUD Operations

Cloudinary Image Uploads

Deployed via Docker or Local Node.js

The API exposes GraphQL queries and mutations for managing users and employees, following the specifications from COMP3133 Assignment 1.

## Technologies Used

Node.js 20+

Express

Apollo Server / GraphQL

MongoDB Atlas

Mongoose

Cloudinary

JWT Authentication

Docker / Docker Compose

## How to Run the Project

Postman Collection is included in this repository.

You can run the application in two ways:

### OPTION 1 — Run Locally (without Docker)

#### 1. Clone the repository

```
git clone <YOUR_REPO_URL>
cd COMP3133_101505276_Assignment1
```

#### 2. Install Dependencies
```
npm install
```

#### 3. Create .env file
```
PORT=4000

MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=comp3133_101505276_Assignment1

JWT_SECRET=your_jwt_secret_key

CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret
```

#### 4. Start the server

Development mode:
```
npm run dev
```

Normal mode:
```
npm start
```

### OPTION 2 — Run Using Docker (Recommended)

#### 1. Build the Docker image

From the project folder
```
docker build -t comp3133-assignment1 
```

#### 2. Run the container

Before running the container make sure you have created your .env file as shown from option 1
```
docker run --name comp3133-app --env-file .env -p 4000:4000 comp3133-assignment1
```

#### 3. Access the API

Open:
```
http://localhost:4000/graphql
```

#### 4. Stop / Restart / Remove Container

Stop:
```
docker stop comp3133-app
```

Start:
```
docker start comp3133-app
```

Delete:
```
docker rm -f comp3133-app
```

