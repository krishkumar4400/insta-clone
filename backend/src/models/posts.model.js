import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: [true, "Caption is required"],
    },
    description: {
      type: String,
    },
    mediaUrl: {
      type: String,
      required: [true, "Post media is required"],
    },
    mediaType: {
      type: String,
      required: [true, "Media type is required"],
    },
    thumbnaiUrl: {
      type: String,
      required: [true, "Thumbnail url is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const postModel = mongoose.models.Post || mongoose.model("Post", postSchema);
export default postModel;
