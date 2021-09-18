const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      user: newUser,
    });
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

    const token = signToken(user._id);

    res.status(200).json({
      status: "Success",
      token,
    });
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

  console.log(verifyToken);

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
