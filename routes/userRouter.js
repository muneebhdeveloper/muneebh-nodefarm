const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/forgetPassword", authController.forgetPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);
userRouter.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
userRouter.patch("/updateMe", authController.protect, userController.updateMe);

module.exports = userRouter;
