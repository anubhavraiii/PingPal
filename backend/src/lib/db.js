import mongoose from 'mongoose';

export const connectDB = async () => {
    const URI = process.env.MONGODB_URI;
    try {
        const conn = await mongoose.connect(URI);
        console.log(`👍 Connection succesfull to DB ${conn.connection.host}`);
    } catch (error) {
        console.log("❌ Database Connection Failed...");
        console.error("Error details:", error.message);
        process.exit(1); 
    }
}