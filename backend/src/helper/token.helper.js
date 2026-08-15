import jwt from "jsonwebtoken";

export const generateToken = (paylaod) => {
  return jwt.sign(paylaod, process.env.JWT_SECRET);
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
