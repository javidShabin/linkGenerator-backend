import express from "express";
import { loginUser, OTPgenerating, verifyOTP } from "../controllers/auth.controller.js";
export const router = express.Router();

// User singup route (Generating OTP)
router.post("/otp-generation", OTPgenerating)

// Verifying the OTP
router.post("/otp-verifying", verifyOTP)

// Login user 
router.post("/login-user", loginUser)