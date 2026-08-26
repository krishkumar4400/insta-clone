import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
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

const likesModel =
  mongoose.models.Likes || mongoose.model("Likes", likesSchema);
export default likesModel;
