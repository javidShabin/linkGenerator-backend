import express from "express";
import { OTPgenerating } from "../controllers/auth.controller.js";
export const router = express.Router();

// User singup route
router.post("/otp-generation", OTPgenerating)