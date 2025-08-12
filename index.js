import dotenv from "dotenv";
dotenv.config();
import express from "express";
const server = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import "./configs/passport.config.js"
import passport from "passport";
import { router as v1Router } from "./routes/index.js";
import { dbConnection } from "./configs/db.config.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
const PORT = process.env.PORT || 3000;

// Middlewares
server.use(
  cors({
    origin: [
      "https://link-generator-frontend-five.vercel.app",
      "https://link-generator-admin-theta.vercel.app",
    ],
    credentials: true,
  })
);
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());

server.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Entry route
server.use("/api/v1", v1Router);

// GLobal error handler
server.use(globalErrorHandler);

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
