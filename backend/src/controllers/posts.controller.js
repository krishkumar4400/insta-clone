import imagekit from "../configs/imagekit.js";
import postModel from "../models/posts.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import { sanitizeFileName } from "../utils/sanitizeFileName.js";

const createPost = asyncHandler(async (req, res, next) => {
  const { caption, description } = req.body;

  const mediaFile = req.file;

  // sanitize original name
  const safeName = sanitizeFileName(mediaFile.originalname);

  // Generate a custom unique name
  const uniqueName = `${Date.now()}-${uuidv4()}-${safeName}`;

  const uploadResult = await imagekit.upload({
    file: mediaFile.buffer, // file buffer from multer
    fileName: uniqueName, // name of the file
    folder: "/insta-clone/posts", // specified folder path
  });

  const post = await postModel.create({
    caption,
    description,
    mediaUrl: uploadResult.url,
    mediaType: uploadResult.fileType,
    thumbnailUrl: uploadResult.thumbnailUrl,
    userId: req.userId,
  });

  if (!post) {
    throw new ApiError(400, "Failed to create a post");
  }

  const data = {
    message: "Post created successfully",
    success: true,
    status: "OK",
    post,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, data, "post created successfully"));
});

const getPostById = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postModel.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const data = {
    message: "Post fetched successfully",
    success: true,
    status: "OK",
    post,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Post fetched successfully"));
});

const getPostMyPosts = asyncHandler(async (req, res, next) => {
  const posts = await postModel.find({ userId: req.userId });
  if (!posts) {
    throw new ApiError(404, "Post not found");
  }

  const data = {
    message: "Post fetched successfully",
    success: true,
    status: "OK",
    posts,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Post fetched successfully"));
});

const getPostByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const posts = await postModel.find({ userId: userId });

  if (!posts) {
    throw new ApiError(404, "Post not found");
  }

  const data = {
    message: "Post fetched successfully",
    success: true,
    status: "OK",
    posts,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Post fetched successfully"));
});

const updatePostCaption = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { caption } = req.body;

  const post = await postModel.findByIdAndUpdate(postId, {
    $set: {
      caption: caption,
    },
  });

  if (!post) {
    throw new ApiError(400, "Failed to update post caption");
  }

  const data = {
    message: "Post caption has been updated successfully",
    success: true,
    status: "OK",
    post,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "Post caption has been updated successfully"),
    );
});

const updatePostMedia = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const mediaFile = req.file;

  // sanitize original name
  const safeName = sanitizeFileName(mediaFile.originalname);

  // Generate a custom unique name
  const uniqueName = `${Date.now()}-${uuidv4()}-${safeName}`;

  const uploadResult = await imagekit.upload({
    file: mediaFile.buffer, // file buffer from multer
    fileName: uniqueName, // name of the file
    folder: "/insta/posts", // specified folder path
  });

  const post = await postModel.findByIdAndUpdate(postId, {
    $set: {
      mediaUrl: uploadResult.url,
      mediaType: uploadResult.fileType,
      thumbnailUrl: uploadResult.thumbnailUrl,
    },
  });

  if (!post) {
    throw new ApiError(400, "Failed to update media");
  }

  const data = {
    message: "Post caption has been updated successfully",
    success: true,
    status: "OK",
    post,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "Post media has been updated successfully"),
    );
});

const updatePostDescription = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { description } = req.body;

  const post = await postModel.findByIdAndUpdate(postId, {
    $set: {
      description: description,
    },
  });

  if (!post) {
    throw new ApiError(400, "Failed to update post decsription");
  }

  const data = {
    message: "Post description has been updated successfully",
    success: true,
    status: "OK",
    post,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        data,
        "Post description has been updated successfully",
      ),
    );
});

const deletePostById = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postModel.findByIdAndDelete(postId);

  if (!post) {
    throw new ApiError(400, "Failed to delete post");
  }

  const data = {
    message: "Post description has been updated successfully",
    success: true,
    status: "OK",
    post,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Post has been deleted successfully"));
});

export {
  createPost,
  getPostById,
  getPostByUserId,
  getPostMyPosts,
  updatePostCaption,
  updatePostDescription,
  updatePostMedia,
  deletePostById,
};
