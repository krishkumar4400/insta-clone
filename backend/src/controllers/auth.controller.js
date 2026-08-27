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
  const { emailVerificationToken } = req.params;

  if (!emailVerificationToken) {
    throw new ApiError(404, "Email verification token is missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(emailVerificationToken)
    .digest("hex");

  const user = await userModel.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Verification token is invalid or expired");
  }

  if (user.isEmailVerified) {
    throw new ApiError(409, "Your email is already verified");
  }

  const updatedUser = await userModel.findByIdAndUpdate(user._id, {
    isEmailVerified: true,
    emailVerificationToken: undefined,
    emailVerificationTokenExpiry: 0,
  });

  if (!updatedUser) {
    throw new ApiError(400, {}, "Failed to verify email");
  }

  const data = {
    message: "Your email has been verified successfully",
    success: true,
    status: "OK",
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
      bio: updatedUser.isEmailVerified,
      role: updatedUser.isEmailVerified,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "Your email has been verified successfully"),
    );
});

const sendAccountVerificationMail = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(409, "You are already verified");
  }

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

  await sendMail({ to: user.email, subject: "Account verification", html });

  const data = {
    message: "Account verification mail has been sent to your email id",
    success: true,
    status: "OK",
    user: {
      username: user.username,
      email: user.email,
      bio: user.isEmailVerified,
      role: user.isEmailVerified,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        data,
        "Account verification mail has been sent to your email id",
      ),
    );
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await userModel.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Old password doesn't match");
  }

  const updatedUser = await userModel.findByIdAndUpdate(user._id, {
    $set: {
      password: newPassword,
      resetPasswordToken: undefined,
      resetPasswordTokenExpiry: 0,
    },
  });

  if (!updatedUser) {
    throw new ApiError(400, "Failed to reset your password");
  }

  const data = {
    message: "Password has been changed successfully",
    success: true,
    status: "OK",
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.isEmailVerified,
      role: updatedUser.isEmailVerified,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Password has been changed successfully"));
});

const changeCurrentUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  const user = await userModel.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await userModel.findByIdAndUpdate(user._id, {
    $set: {
      username: username,
    },
  });

  if (!updatedUser) {
    throw new ApiError(400, "Failed to update username");
  }

  const data = {
    message: "username has been changed successfully",
    success: true,
    status: "OK",
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.isEmailVerified,
      role: updatedUser.isEmailVerified,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "username has been changed successfully"));
});

const sendForgotPasswordMail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findById({ email });

  if (!user) {
    throw new ApiError(404, "user not found with this email address");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const html = `<div>
        <h1>Forogt Password Email</h1>
        <div>
            <p>To reset your password click on the lin given below</p>
            <a href="http://localhost:8000/api/v1/auth/reset-password-email/${unHashedToken}"></a>
        </div>
    </div>`;

  await sendMail({ to: email, subject: "Reset Password email", html });

  const data = {
    message: "Forgot pass mail has been sent to your email id",
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        data,
        "Forgot pass mail has been sent to your email id",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  const { newPassword } = req.body;

  if (!resetPasswordToken) {
    throw new ApiError(404, "Reset password token is missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Reset password token is invalid or expired");
  }

  const updatedUser = await userModel.findByIdAndUpdate(user._id, {
    $set: {
      password: newPassword,
      resetPasswordToken: undefined,
      resetPasswordTokenExpiry: 0,
    },
  });

  const data = {
    message: "your password has been changed successfully",
    success: true,
    status: "OK",
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.isEmailVerified,
      role: updatedUser.isEmailVerified,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "your password has been changed successfully"),
    );
});

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
