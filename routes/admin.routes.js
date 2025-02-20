import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  deleteUserAccount,
  getAllUser,
  toggleUserActiveStatus,
} from "../controllers/admin.controller.js";
export const router = express.Router();

// Get users details function
router.get("/user-details", authenticate, authorize("admin"), getAllUser);

// Update user profile status active and deactivate
router.put(
  "/toggle-active/:userId",
  authenticate,
  authorize("admin"),
  toggleUserActiveStatus
);

// Detete user by id route
router.delete(
  "/delete-user/:userId",
  authenticate,
  authorize("admin"),
  deleteUserAccount
);
