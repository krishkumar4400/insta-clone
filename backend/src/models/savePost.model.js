import mongoose from "mongoose";

const savePostSchema = new mongoose.Schema(
  {
    userId: {
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

const savePostModel =
  mongoose.models.SavedPost || mongoose.model("SavedPost", savePostSchema);
export default savePostModel;
