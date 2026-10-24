import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Model } from "mongoose";
import type { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

// 1. User document fields
interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  fullName?: string;
  bio?: string;
  profilePicture?: string;
  website?: string;
  isPrivate: boolean;
  isVerified: boolean;
  refreshToken?: string;
}

// 2. Custom document methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// 3. Typed mongoose model
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
    passwordHash: {
      type: String,
      trim: true,
      select: false,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    profilePicture: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
      maxlength: 2048,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// 4. Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return;
  }
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  return;
});

// 5. Compare passwords
userSchema.method(
  "comparePassword",
  async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
  },
);

// 6. Generate access token
userSchema.method("generateAccessToken", function (): string {
  return jwt.sign({ userId: this._id.toString() }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as StringValue,
  });
});

// 7. Generate refresh token
userSchema.method("generateRefreshToken", function (): string {
  return jwt.sign({ userId: this._id.toString() }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as StringValue,
  });
});

const userModel =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<IUser, UserModel>("User", userSchema);
export default userModel;
