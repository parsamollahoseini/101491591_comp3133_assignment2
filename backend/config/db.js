const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbName = process.env.MONGO_DB_NAME || 'comp3133_StudentID_Assigment1';

        await mongoose.connect(process.env.MONGO_URI, {
            dbName
        });

        console.log(`MongoDB connected to database: ${dbName}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;