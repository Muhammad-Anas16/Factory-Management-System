export const sendResponse = (res, { statusCode = 200, success = true, message = "", data = null, error = null }) => {
  return res.status(statusCode).json({ success, message, data, error });
};

export const successResponse = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, { statusCode, success: true, message, data, error: null });
};

export const errorResponse = (res, message, error = null, statusCode = 400) => {
  return sendResponse(res, { statusCode, success: false, message, data: null, error });
};