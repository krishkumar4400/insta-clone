import mongoose from "mongoose";
import ApiError from "../utils/api-error.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongo db");
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to conenct with database", error);
  }
};

export default connectToDB;
