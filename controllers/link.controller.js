// *************************************************************
// ****************** Whatsapp link generating controllers *****************

import {
  generateShortLink,
  generateSlug,
  generateWhatsAppLink,
} from "../utils/generateLink.js";
import { linkGeneratingValidation } from "../validators/link.validation.js";

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
    
  } catch (error) {
    next(error);
  }
};
