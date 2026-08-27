import likesModel from "../models/likes.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

const likePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.userId;

  const isAlreadyLiked = await likesModel.findOne({
    userId,
    postId,
  });

  if (isAlreadyLiked) {
    throw new ApiError(409, "You have already liked the post");
  }

  const like = await likesModel.create({
    userId,
    postId,
  });

  if (!like) {
    throw new ApiError(400, "Failed to like the post");
  }

  const data = {
    message: "Your Like added to the post successfully",
    success: true,
    status: "CREATED",
    like,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(201, data, "Your Like added to the post successfully"),
    );
});

const unLikePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.userId;

  const like = await likesModel.findOne({ postId, userId });

  if (!like) {
    throw new ApiError(404, "You haven't liked the post");
  }

  const deletedLike = await likesModel.findByIdAndDelete(like._id);

  if (!deletedLike) {
    throw new ApiError(400, "Failed to unlike the post");
  }

  const data = {
    message: "Failed to unlike the post",
    success: true,
    status: "OK",
    like,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Failed to unlike the post"));
});

export { likePost, unLikePost };
