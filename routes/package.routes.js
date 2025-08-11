import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createPackage, deletePackage, getAllPackages, updatePackage } from "../controllers/package.controller.js";
export const router = express.Router();

// Create package route
router.post("/create-package",authenticate, authorize("admin"), createPackage);

// Update package route
router.put("/package/:id", authenticate, authorize("admin"), updatePackage);

// Delete package route
router.delete("/del-package/:id", authenticate, authorize("admin"), deletePackage);

// Get all packages route
router.get("/get-packages", getAllPackages)