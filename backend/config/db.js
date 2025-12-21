import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_CONNECTIONSTRING) {
            throw new Error("MONGODB_CONNECTIONSTRING is not defined");
        }
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Connected to MongoDB");
        return mongoose.connection;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
};

export default connectDB;