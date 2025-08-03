import dotenv from "dotenv";
dotenv.config();
import express from "express";
const server = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { dbConnection } from "./configs/db.config.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
const PORT = process.env.PORT || 3000;

// Middlewares
server.use(
  cors({
    origin: true,
    credentials: true,
  })
);
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());
server.use(globalErrorHandler)

server.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Database connection function
dbConnection()
  .then(() => {
    console.log("Database Connected...!");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
