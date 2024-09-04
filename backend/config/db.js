import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if(!mongoURI) throw new Error("MONGO_URI is not defined in environment variables")

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}