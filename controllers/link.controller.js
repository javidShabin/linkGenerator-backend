// *************************************************************
// ****************** Whatsapp link generating controllers *****************

import {
  generateShortLink,
  generateSlug,
  generateWhatsAppLink,
} from "../utils/generateLink.js";
import userSchema from "../models/user.model.js";
import linkSchema from "../models/link.model.js";
import { linkGeneratingValidation } from "../validators/link.validation.js";
import { success } from "../shared/response.js";
import { MESSAGES } from "../shared/constants.js";
import { AppError } from "../utils/AppError.js";

// ********************************************************************************
// ************** Generate, Update, Delete ***************************************

// Generate whatsapp link including brand page and short link
export const generateLink = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user id from authentication
    // Validate the data first
    linkGeneratingValidation(req.body);
    // Destructer the details from request body
    const { phone, message, customSlug } = req.body;

    // generate the slug
    const slug = generateSlug(customSlug);
    // Generate the whatsapp link
    const whatsappLink = generateWhatsAppLink(phone, message);
    //  Generate short link using slug
    const shortLink = generateShortLink(slug);

    // Declare the two variable with null for store the base url and user id
    let brandedPageUrl = null;
    let userIds = null;

    // Find user by user id
    const user = await userSchema.findById(userId);
    if (!user) return next(new AppError(MESSAGES.USER_NOT_FOUND, 404));

    // Check the user is pro or not
    if (user.isPro) {
      if (!user.id) {
        return next(new AppError(MESSAGES.MUST_BE_PRO, 400));
      }

      userIds = user.id;
      brandedPageUrl = `${process.env.CLIENT_URL}/${userIds}`;
    }
    // Create new link with the details
    const newLink = new linkSchema({
      userId,
      slug,
      phone,
      message,
      whatsappLink,
      brandedPageUrl,
      shortLink,
      username: user.userName,
    });
    // Save the link
    await newLink.save();

    const data = {
      slug: newLink.slug,
      whatsappLink: newLink.whatsappLink,
      brandedPageUrl: newLink.brandedPageUrl,
      shortLink: newLink.shortLink,
    };

    success(res, data, MESSAGES.LINK_CREATED);
  } catch (error) {
    next(error);
  }
};

// Update link using slug
export const updateLink = async (req, res, next) => {
  try {
    // Get the slug from the request parameters
    const { slug } = req.params;
    // Get details from request body
    const { phone, message, customSlug } = req.body;
    // Find the link by slug
    const existingLink = await linkSchema.findOne({ slug });
    // Check if the link exists
    if (!existingLink) {
      throw new AppError("Link is not found", 404);
    }
    // Update fields if provided
    if (phone) existingLink.phone = phone;
    if (message !== undefined) existingLink.message = message;

    // Optional: Regenerate slug if customSlug provided
    if (customSlug) {
      existingLink.slug = generateSlug(customSlug);
    }
    // Regenerate WhatsApp link
    existingLink.whatsappLink = generateWhatsAppLink(
      existingLink.phone,
      existingLink.message
    );

    // Save the updated link
    await existingLink.save();
    // Send respose
    success(res, existingLink, MESSAGES.LINK_UPDATED);
  } catch (error) {
    next(error);
  }
};

// Delete the link
export const deleteLink = async (req, res, next) => {
  try {
    // Get the slug from request params
    const { slug } = req.params;
    // Find the link by slug
    const deletedLink = await linkSchema.findOneAndDelete({ slug });

    if (!deletedLink) {
      return next(new AppError("Link not found", 404)); // Not found any link by the sluge throw error
    }

    // send deleted response
    success(res, null, MESSAGES.LINK_DELETED);
  } catch (error) {
    next(error);
  }
};

// *******************************************************************************
// ********************** Link geting controllers *********************************

// Get count of generated links for admin
export const getLinkCount = async (req, res, next) => {
  try {
    // Get total links count from the database
    const totalLinks = await linkSchema.countDocuments();
    // Send response
    success(res, totalLinks, MESSAGES.LINK_COUNT);
  } catch (error) {
    next(error);
  }
};

// Get previous links for users
export const getPreviousLinks = async (req, res, next) => {
  try {
    // Get user id from authentication
    const userId = req.user.id;
    // Find all links by user id
    const links = await linkSchema.find({ userId });
    // If not get any links throw error
    if (!links) {
      return next(new AppError("Not previous link not found", 404));
    }
    // Send response to client
    success(res, links, MESSAGES.LINK_PREVIOUS);
  } catch (error) {
    next(error);
  }
};

// Get latest link for brand page chat button
export const getLatestLink = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Fetch latest link for user
    const latestLink = await linkSchema
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestLink) {
      // If link is not fount throw error
      return next(new AppError("No link found for this user", 404));
    }

    // Fetch user details
    const user = await userSchema
      .findById(userId)
      .select("name email userName isPro profileImg");

    if (!user) {
      // The user is not found throw error
      return next(new AppError("User not found", 404));
    }

    // Store the datas to variable
    const data = {
      slug: latestLink.slug,
      whatsappLink: latestLink.whatsappLink,
      brandedPageUrl: latestLink.brandedPageUrl,
      user: {
        name: user.name,
        email: user.email,
        userName: user.userName,
        isPro: user.isPro,
        profileImg: user.profileImg,
      },
    };

    // Send response to client
    success(res, data, MESSAGES.LINK_LATEST);
  } catch (error) {
    next(error);
  }
};

// ******************** Track link usage **************************
// Track link usage
export const trachLinkUsage = async (req, res, next) => {
  try {
    // Destructer the slug from request params
    const { slug } = req.params;
    // Find the link using the slug
    const link = await linkSchema.findOne({ slug });
    // The link is not found throw error
    if (!link) {
      return next(new AppError("Link not found", 404));
    }
    // Increment the clicks count
    link.clicks = (link.clicks || 0) + 1;
    await link.save(); // save the count

    let clicks = link.clicks;
    // Send the response to client
    success(res, clicks, MESSAGES.LINK_TRACK);
  } catch (error) {
    next(error);
  }
};
