import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Fixed typo
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error(`ERROR: ${error.message}`); // Use backticks
        process.exit(1);
    }
};

export default connectDB;
