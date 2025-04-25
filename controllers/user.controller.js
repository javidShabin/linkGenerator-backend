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
      return next(new AppError("User not found", 404));
    }

    // If provide any image file then upload the file to cloudinary
    if (req.file) {
      // Upload the file then store to variable
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (!uploadResult.success) {
        return res.status(500).json({
          success: false,
          message: uploadResult.message,
          error: uploadResult.error,
        });
      }
      // Assign the data to insted of user profile image
      updateData.profileImg = uploadResult.url;
    }
    // Update user with new data
    const updatedUser = await userSchema.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    // Send the response
    success(res, updatedUser, "User profile updated successfully");
  } catch (error) {
    next(error);
  }
};

// Check user authectioncation
export const checkUser = async (req, res, next) => {
  try {
    // Check the user id is present
    if (!req.user || !req.user.id) {
      return next(new AppError("User not authorized", 401));
    }
    // Find the user by user id
    const user = await userSchema.findById(req.user.id).select("-password");
    // Throw error if not any user with id
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    // Send respsoer
    return success(res, user, "User authorized");
  } catch (err) {
    next(err);
  }
};

// Check user is premium user
export const isProUser = async (req, res, next) => {
  try {
    // Check the user id is present
    if (!req.user) {
      return next(new AppError("User not authorized", 401));
    }
    // Fetch full user data (excluding password)
    const user = await userSchema.findById(req.user.id).select("-password");
    if (!user) {
      return next(new AppError("User not pro", 404));
    }
    // Check the user is pro or normal
    if (user.isPro !== true) {
      return next(new AppError("You are not a premium user", 403));
    }
    // If user authorized
    success(res, user, "Your a premium user");
  } catch (error) {
    next(error);
  }
};
