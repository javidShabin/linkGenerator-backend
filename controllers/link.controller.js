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
