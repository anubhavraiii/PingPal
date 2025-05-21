import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());   

app.use(cookieParser()); // to parse the cookies in the request
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allowing credentials (cookies) to be sent
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
  connectDB();
});
