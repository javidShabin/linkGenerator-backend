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
    if (!user) return next(new AppError("User not found", 404));

    // Check the user is pro or not
    if (user.isPro) {
      if (!user.id) {
        return next(
          new AppError(
            "You must become premium user for generate brand page link",
            400
          )
        );
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

    success(res, data, "Link generated successfully");
  } catch (error) {
    next(error);
  }
};
