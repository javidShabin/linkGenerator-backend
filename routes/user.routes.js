import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";
export const router = express.Router();

// *******************************************************************
// ***************** User profile routes *****************************

router.get(
  "/user-profile",
  authenticate,
  authorize("user", "pro", "admin"),
  getUserProfile
);
