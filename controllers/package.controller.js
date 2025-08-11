import packageSchema from "../models/package.model.js";
import { success } from "../shared/response.js";
import { AppError } from "../utils/AppError.js";
import { createPackageValidation } from "../validators/package.validation.js";

// Create package
export const createPackage = async (req, res, next) => {
  try {
    createPackageValidation(req.body)
    const { name, price, duration, features, currency } = req.body;

    // Check if already exists
    const isPackage = await packageSchema.findOne({ name });
    if (isPackage) {
      return next(new AppError("Package already exist", 400));
    }

    // Create new package
    const newPackage = await packageSchema.create({
      name,
      price,
      duration,
      features,
      currency
    });
    success(res, newPackage, "Package created")
  } catch (error) {
    next(error);
  }
};

// Update package
export const updatePackage = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    const { name, price, duration, features, currency } = req.body;

    const updatedData = { name, price, duration, features, currency };

    const updated = await packageSchema.findByIdAndUpdate(packageId, updatedData, { new: true });

    if (!updated) throw new AppError("Package not found", 404);

    success(res, updated, "Package updated")
  } catch (error) {
    next(error);
  }
};

// Delete package
export const deletePackage = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    const deleted = await packageSchema.findByIdAndDelete(packageId);
    if (!deleted) throw new AppError("Package not found", 404);
    success(res, null , "Package deleted")
  } catch (error) {
    next(error);
  }
};

// Get all packages
export const getAllPackages = async (req, res, next) => {
  try {
    const packages = await packageSchema.find({ isActive: true });
    success(res, packages, "Packages fetched")
  } catch (error) {
    next(error);
  }
};