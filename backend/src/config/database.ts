import mongoose from "mongoose";
import { env } from "./env.js";

const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    } else {
      console.error("MongoDB connection failed:", error);
    }

    throw error;
  }
};

export default connectToDB;
