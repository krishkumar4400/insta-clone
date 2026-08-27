import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import { ENV } from "../configs/env.js";

const authenticationMiddleware = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new ApiError(401, "You are not logged in");
  }

  try {
    const decoded = jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    throw new ApiError(401, "Access token is invalid or expired", error);
  }
});

const isAuthenticated = asyncHandler((req, res, next) => {
  if (!req.userId) {
    throw new ApiError(401, "unauthorized");
  }

  return next();
});

export { authenticationMiddleware, isAuthenticated };
