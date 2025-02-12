import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  deleteLink,
  generateLink,
  updateLink,
} from "../controllers/link.controller.js";
export const router = express.Router();

// Generate link route
router.post(
  "/generate-link",
  authenticate,
  authorize("user", "pro"),
  generateLink
);

// Update link using slug
router.put(
  "/update-link/:slug",
  authenticate,
  authorize("user", "pro"),
  updateLink
);

// Delete link route
router.delete(
  "/delete-link/:slug",
  authenticate,
  authorize("user", "pro"),
  deleteLink
);
