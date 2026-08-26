import mongoose from "mongoose";
import {
  AvailableFollowRequestStatus,
  FollowRequestStatusEnum,
} from "../utils/constants.js";

const followSchema = new mongoose.Schema(
  {
    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Followee id is missing"],
    },
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follower id is missing"],
    },
    status: {
      type: String,
      enum: AvailableFollowRequestStatus,
      default: FollowRequestStatusEnum.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

const followModel =
  mongoose.models.Follow || mongoose.model("Follow", followSchema);
export default followModel;
