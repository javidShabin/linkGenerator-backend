import { nanoid } from "nanoid";

export const generateSlug = (customSlug) => {
  return customSlug || nanoid(15);
};

export const generateWhatsAppLink = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message || "");
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const generateShortLink = (slug) => {
  return `${process.env.CLIENT_URL}/s/${slug}`;
};