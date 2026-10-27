import mongoose, { Model } from "mongoose";
import type { IPost } from "../types/models.types.js";

type PostModel = Model<IPost, {}>;

const postSchema = new mongoose.Schema<IPost, PostModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      red: "User",
      required: [true, "user id is required"],
      trim: true,
      index: true,
    },
    caption: {
      type: String,
      required: [true, "caption is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const postModel =
  (mongoose.models.Post as PostModel | undefined) ??
  mongoose.model<IPost, PostModel>("Post", postSchema);

export default postModel;
