import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  deleteLink,
  generateLink,
  getLatestLink,
  getLinkCount,
  getLinkCountByUser,
  getPreviousLinks,
  trachLinkUsage,
  updateLink,
} from "../controllers/link.controller.js";
export const router = express.Router();

// ********************************************************************
// **************** Generate , Update, Delete ************************

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

// ***************************************************************
// ****************** Links getting routes ************************

// Link count route
router.get("/get-link-count", authenticate, authorize("admin"), getLinkCount);

// Link count route for user
router.get("/get-link-count-user", authenticate, authorize("user", "pro"), getLinkCountByUser)

router.get(
  "/get-prev-links",
  authenticate,
  authorize("user", "pro"),
  getPreviousLinks
);

// Latest link geting route
router.get("/get-latest-link/:userId", getLatestLink);

// **********************************************************************
// Track link usage

router.get("/track-link/:slug", trachLinkUsage)
