import express from "express";
import { OTPgenerating, verifyOTP } from "../controllers/auth.controller.js";
export const router = express.Router();

// User singup route (Generating OTP)
router.post("/otp-generation", OTPgenerating)

// Verifying the OTP
router.post("/otp-verifying", verifyOTP)