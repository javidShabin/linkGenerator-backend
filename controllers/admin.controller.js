import userSchema from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { error, success } from "../shared/response.js";

// ***************************************************************************
// ********************* Users controllers for admin **********************************

// Get all users , users count pro users count
export const getAllUser = async (req, res, next) => {
  try {
    // Get all list of users without admin
    const users = await userSchema
      .find({ role: { $ne: "admin" } })
      .select("-password");

    // Get the all users count
    const totalUsers = await userSchema.countDocuments({
      role: { $ne: "admin" },
    });

    // Get all list of premium users
    const proUser = await userSchema.countDocuments({
      role: { $ne: "admin" },
      isPro: true,
    });

    // Get count of premium users
    const proUsersCount = await userSchema.countDocuments({
      role: { $ne: "admin" },
      isPro: true,
    });

    const result = { users, totalUsers, proUser, proUsersCount };

    success(res, result, "Users fetched successfully");
  } catch (error) {
    next(error);
  }
};

// TOggle usres profile active status
export const toggleActiveStatus = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Delete the users profile (account)
export const deleteUserAccount = async (req, res, next) => {
  try {
  } catch (error) {}
};
