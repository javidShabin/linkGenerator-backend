import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  checkUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
export const router = express.Router();

// *******************************************************************
// ***************** User profile routes *****************************

// Get user profile by user id
router.get(
  "/user-profile",
  authenticate,
  authorize("user", "pro", "admin"),
  getUserProfile
);

// Update the user profile by user id
router.patch(
  "/update-user-profile",
  authenticate,
  authorize("user", "pro", "admin"),
  upload.single("profileImg"),
  updateUserProfile
);

// Check user authentication
router.get(
  "/check-user",
  authenticate,
  authorize("user", "pro", "admin"),
  checkUser
);
