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
    // Get user id from authentication
     const userId = req.user.id;
     // Destructure the datas for editing
    const { userName, email, phone } = req.body;
    // Prepare the data to update
    const updateData = { userName, email, phone };
    // Check if user exists
    const user = await userSchema.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404))
    }

    res.send(user, req.file)
  } catch (error) {
    next(error)
  }
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
