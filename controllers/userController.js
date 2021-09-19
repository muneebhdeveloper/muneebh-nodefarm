const User = require("./../models/userModel");
const filterObj = require("./../utils/filterObj");

exports.updateMe = async (req, res) => {
  try {
    // Check if user is sending password an passwordConfirm data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(405).json({
        status: "fail",
        message:
          "This route is not handling password updates, Please send patch to request to /updatePassword route",
      });
    }

    //  Update the user
    const filteredBody = filterObj(req.body, ["name", "email"]);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    //  Send the response with the updated user
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "success",
      results: user.length,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};
