// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { getUserFromToken } = require('./utils/auth');

const startServer = async () => {
    const app = express();

    app.use(cors());
    app.use(express.json({ limit: '10mb' })); // support base64 image uploads

    await connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const user = getUserFromToken(authHeader);
            return { user };
        }
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}${server.graphqlPath}`
        );
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err.message);
});