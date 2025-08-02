import dotenv from "dotenv";
dotenv.config();
import express from "express"
const server = express()
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
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


server.get("/", (req, res) => {
  res.send("Server is up and running!");
});

server.listen(() => {
    console.log(`Server is running on port ${PORT}`);
})