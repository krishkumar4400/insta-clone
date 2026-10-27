import type { ObjectId } from "mongoose";

// 1. User document fields
export interface IUser {
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
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}


export interface IPost {
  userId: ObjectId;
  caption: string;
  location: string;
  mediaType: string;
  mediaUrl: string;
  createdAt: Date;
  updatedAt: Date;
}