import userSchema from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { error, success } from "../shared/response.js";
import { MESSAGES } from "../shared/constants.js";

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

    success(res, result, MESSAGES.USERS_FETCHED);
  } catch (error) {
    next(error);
  }
};

// TOggle usres profile active status
export const toggleUserActiveStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await userSchema.findById(userId);
    if (!user) {
      return next(new AppError(MESSAGES.USER_NOT_FOUND, 404));
    }

    // Toggle isActive and update
    const updatedUser = await userSchema
      .findByIdAndUpdate(
        userId,
        { isActive: !user.isActive },
        { new: true, runValidators: true }
      )
      .select("_id isActive");

    // Use success() utility to return response
    return success(
      res,
      {
        userId: updatedUser._id,
        isActive: updatedUser.isActive,
      },
      `User has been ${
        updatedUser.isActive ? "activated" : "deactivated"
      } successfully`
    );
  } catch (error) {
    next(error);
  }
};

// Delete the users profile (account)
export const deleteUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await userSchema.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Delete the user
    await userSchema.findByIdAndDelete(userId);

    return success(res, null, "User account deleted successfully");
  } catch (error) {
    next(error);
  }
};
