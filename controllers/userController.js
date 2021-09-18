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
