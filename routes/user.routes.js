import express from "express";
import {
  generateForgotPasswordOtp,
  loginUser,
  logOutUser,
  OTPgenerating,
  verifyForgotPasswordOtp,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
export const router = express.Router();

// ***************** Authentication routes *********************

// User singup route (Generating OTP)
router.post("/otp-generation", OTPgenerating);

// Verifying the OTP
router.post("/otp-verifying", verifyOTP);

// Login user
router.post("/login-user", loginUser);

// Logout user (clear token from cookie)
router.delete(
  "/user-logout",
  authenticate,
  authorize("user", "pro", "admin"),
  logOutUser
);

// ********************* Password routes **********************

// Route for OTP genreating for password changing
router.post("/forgot-password/otp", generateForgotPasswordOtp)

// Verifying the password changing OTP route
router.post("/forgot-password/reset", verifyForgotPasswordOtp)