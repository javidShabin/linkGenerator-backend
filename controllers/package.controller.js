import packageSchema from "../models/package.model.js";
import { success } from "../shared/response.js";
import { AppError } from "../utils/AppError.js";
import { createPackageValidation } from "../validators/package.validation.js";

// Create package
export const createPackage = async (req, res, next) => {
  try {
    // Validate first the details
    createPackageValidation(req.body);
    // Destructer the details from the request body
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
      currency,
    });
    success(res, newPackage, "Package created");
  } catch (error) {
    next(error);
  }
};

// Update package
export const updatePackage = async (req, res, next) => {
  try {
    // Get the package id from request params
    const packageId = req.params.id;
    // Destructure the details from request body
    const { name, price, duration, features, currency } = req.body;

    // Store the upaated data to variable
    const updatedData = { name, price, duration, features, currency };

    // Upadate the by package id
    const updated = await packageSchema.findByIdAndUpdate(
      packageId,
      updatedData,
      { new: true }
    );
    if (!updated) return next(new AppError("Package not found", 404));

    // Send response
    success(res, updated, "Package updated");
  } catch (error) {
    next(error);
  }
};

// Delete package
export const deletePackage = async (req, res, next) => {
  try {
    // Get the package id from params
    const packageId = req.params.id;
    // delete the package by id
    const deleted = await packageSchema.findByIdAndDelete(packageId);
    if (!deleted) return next(new AppError("Package not found", 404));
    success(res, null, "Package deleted");
  } catch (error) {
    next(error);
  }
};

// Get all packages
export const getAllPackages = async (req, res, next) => {
  try {
    const packages = await packageSchema.find({ isActive: true });
    success(res, packages, "Packages fetched");
  } catch (error) {
    next(error);
  }
};

// Get all packages for admin
export const getAllPackagesAdmin = async (req, res, next) => {
  try {
    // Fidn the packages 
    const packages = await packageSchema.find({});
    // Send response
    res.status(200).json({ message: "Packages fetched", data: packages });
  } catch (error) {
    next(error);
  }
}

// Toggle package status (active/deactive)
export const togglePackageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find package
    const pkg = await packageSchema.findById(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Toggle the isActive value
    pkg.isActive = !pkg.isActive;
    await pkg.save();

    res.status(200).json({
      message: `Package ${pkg.isActive ? "activated" : "deactivated"} successfully`,
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};