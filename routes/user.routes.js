import express from "express";
import {
  loginUser,
  logOutUser,
  OTPgenerating,
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
