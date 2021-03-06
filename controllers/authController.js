const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (res, options) => {
  const token = signToken(options.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(options.statusCode).json({
    status: "success",
    token,
    data: {
      user: options.data,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(res, { id: newUser._id, statusCode: 201, data: newUser });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //   Check if Email and Password received
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    // Check if user exists in the database

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    user.password = undefined;

    createSendToken(res, { id: user._id, statusCode: 201, data: user });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  let authToken;

  // Check header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  }

  if (!authToken) {
    return res.status(401).json({
      status: "fail",
      message: "You are not authorized to access this route, Please login",
    });
  }

  // Verify token
  const verifyToken = await promisify(jwt.verify)(
    authToken,
    process.env.JWT_SECRET
  );

  // Checks if user exist
  const userExist = await User.findById(verifyToken.id);
  if (!userExist) {
    return res.status(401).json({
      status: "fail",
      message: "User does not longer exist",
    });
  }

  // Checks if password changed after assigning the token
  if (userExist.changedPasswordAfterToken(verifyToken.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "User has changed password, Please log in again",
    });
  }

  req.user = userExist;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "Now Allowed",
        message: "You are not allowed to perform this action",
      });
    }

    next();
  };
};

exports.getUserAndTourId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.forgetPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(401).json({
        status: "error",
        message: "Please provide your email address",
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Email doesn't' exist",
      });
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const message = `Click the link below \n ${req.protocol}://${req.hostname}/resetPassword/${resetToken}`;

    // Sending the link to the user for Password Reset
    try {
      const mailFormat = {
        email: user.email,
        subject: "Your password reset token (Valid for 10 min)",
        message,
      };

      await sendEmail(mailFormat);
      return res.status(200).json({
        status: "success",
        message: "Password reset token send to your email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({
        status: "fail",
        message: "Something went wrong on the server side, Please try again",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.resetPassword = async (req, res) => {
  // Get the user based on the token and check token is not expired
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(res, { id: user._id, statusCode: 200, data: user });
};

exports.updatePassword = async (req, res, next) => {
  try {
    // Get the user from Collection
    // const token = req.headers.authorization.split(" ")[1];
    // const verifyToken = await promisify(jwt.verify)(
    //   token,
    //   process.env.JWT_SECRET
    // );

    const user = await User.findById(req.user.id).select("+password");

    // Check if POSTed password is correct
    const isCurrentPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isCurrentPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid current password",
      });
    }

    // If correct, then update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    user.password = undefined;

    // Log user in, send JWT
    createSendToken(res, { id: user._id, statusCode: 200, data: user });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};
