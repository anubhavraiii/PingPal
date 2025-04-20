import express from "express";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();

app.use(express.json({ limit: "10mb" }));   

app.use(cookieParser()); // to parse the cookies in the request
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allowing credentials (cookies) to be sent
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
  connectDB();
});
