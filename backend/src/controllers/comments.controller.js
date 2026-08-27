import mongoose from "mongoose";
import commentModel from "../models/comment.model.js";
import postModel from "../models/posts.model.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

const postComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { commentText } = req.body;

  const post = await postModel.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await commentModel.create({
    userId: new mongoose.Types.ObjectId(req.userId),
    postId: new mongoose.Types.ObjectId(postId),
    content: commentText,
  });

  if (!comment) {
    throw new ApiError(400, "Failed to add comment to the post");
  }

  const data = {
    message: "Comment added successfully",
    success: true,
    status: "CREATED",
    comment,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, data, "Comment added successfully"));
});

const getCommentsByPostId = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const comments = await commentModel.find({ postId });

  if (!comments || comments.length < 1) {
    throw new ApiError(404, "This post don't have any comment");
  }

  const data = {
    message: "Comment fetched successfully",
    success: true,
    status: "OK",
    comments,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "This post don't have any comment"));
});

const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const data = {
    message: "Comment fetched successfully",
    success: true,
    status: "OK",
    comment,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Comment fetched successfully"));
});

const updateComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { commentText } = req.body;

  const comment = await commentModel.findByIdAndUpdate(commentId, {
    $set: {
      content: commentText,
    },
  });

  if (!comment) {
    throw new ApiError(400, "Failed to update comment");
  }

  const data = {
    message: "Failed to update comment",
    success: true,
    status: "OK",
    comment,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Failed to update comment"));
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await commentModel.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(400, "Failed to delete comment");
  }

  const data = {
    message: "comment deleted successfully",
    success: true,
    status: "OK",
    comment,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "comment deleted successfully"));
});

export {
  postComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
};
