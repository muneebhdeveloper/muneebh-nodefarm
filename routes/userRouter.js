const express = require("express");
const authController = require("./../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/forgetPassword", authController.forgetPassword);
userRouter.patch("/resetPassword", authController.resetPassword);

module.exports = userRouter;
