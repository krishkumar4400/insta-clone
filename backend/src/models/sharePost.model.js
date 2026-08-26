import mongoose from "mongoose";

const sharePostSchema = new mongoose.Schema(
  {
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is missing"],
    },
    sharedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is missing"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "post id is missing"],
    },
  },
  {
    timestamps: true,
  },
);

const sharePostModel =
  mongoose.models.SharedPost || mongoose.model("SharedPost", sharePostSchema);
export default sharePostModel;
