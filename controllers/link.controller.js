
// *************************************************************
// ****************** Whatsapp link generating controllers *****************

import { linkGeneratingValidation } from "../validators/link.validation.js"

export const generateLink = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get user id from authentication
        // Validate the data first
        linkGeneratingValidation(req.body)
        // Destructer the details from request body
         const { phone, message, customSlug } = req.body;
    } catch (error) {
        next(error)
    }
}