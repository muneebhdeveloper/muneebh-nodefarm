const User = require("./../models/userModel");

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: "success",
      user: newUser,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};
