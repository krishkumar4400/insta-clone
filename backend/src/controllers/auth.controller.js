import userModel from "../models/user.model.js";
import sendMail from "../services/mail.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import generateAccessAndRefreshToken from "../utils/auth-token.js";
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(
      401,
      existingUser.username === username
        ? "username already exists"
        : "email already exists",
    );
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const data = {
    message: "user registered successfully",
    success: true,
    status: "CREATED",
    user: {
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      bio: user.isEmailVerified,
      role: user.isEmailVerified,
    },
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const html = `<div>
        <h1>Account Verification Email</h1>
        <div>
            <p>To verify your email click on the lin given below</p>
            <a href="http://localhost:8000/api/v1/auth/verify-email/${unHashedToken}"></a>
        </div>
    </div>`;

  await sendMail({ to: email, subject: "Account verification mail", html });

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, data, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new ApiError(401, "incorrect email or password");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "incorrect email or password");
  }
  const data = {
    message: "user logged in successfully",
    success: true,
    status: "OK",
    user: {
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      bio: user.isEmailVerified,
      role: user.isEmailVerified,
    },
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, data, "user logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  
});

const sendAccountVerificationMail = asyncHandler(async (req, res, next) => {});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {});

const changeCurrentUsername = asyncHandler(async (req, res, next) => {});

const sendForgotPasswordMail = asyncHandler(async (req, res, next) => {});

const resetPassword = asyncHandler(async (req, res, next) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  sendAccountVerificationMail,
  changeCurrentPassword,
  changeCurrentUsername,
  sendForgotPasswordMail,
  resetPassword,
};
