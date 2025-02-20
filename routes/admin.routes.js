import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  getAllUser,
  toggleUserActiveStatus,
} from "../controllers/admin.controller.js";
export const router = express.Router();

// Get users details function
router.get("/user-details", authenticate, authorize("admin"), getAllUser);
router.put(
  "/toggle-active/:userId",
  authenticate,
  authorize("admin"),
  toggleUserActiveStatus
);
