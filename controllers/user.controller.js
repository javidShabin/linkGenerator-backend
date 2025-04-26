import userSchema from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { uploadToCloudinary } from "../services/cloudinaryUpload.js";
import { error, success } from "../shared/response.js";

// ***************** User Profile functionalites *****************
// ***************************************************************

// Get user profile by id
export const getUserProfile = async (req, res, next) => {
  try {
    // Get the user id from authentication
    const userId = req.user.id;

    // Find the user profile by user id
    const user = await userSchema.findById(userId).select("-password");

    // Throw error if the user is not found
    if (!user) {
      return error(res, "User not found", 404);
    }

    // Send user profile
    return success(res, user, "User profile fetched successfully");
  } catch (err) {
    next(err);
  }
};


// Update user Profile
export const updateUserProfile = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Check user authectioncation
export const checkUser = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Check user is premium user
export const userIsPro = async (req, res, next) => {
  try {
  } catch (error) {}
};
