import userModel from "../models/user.model.js";
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const data = {
    message: "User data fetched successfully",
    success: true,
    status: "OK",
    user,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "User data fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully"));
});

export { getUserById, getAllUsers };
