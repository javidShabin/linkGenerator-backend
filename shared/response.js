export const success = (res, data, message = "Success") => {
  return res.status(200).json({ success: true, message, data });
};

export const error = (res, message = "Something went wrong", statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};
