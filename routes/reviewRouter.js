const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const reviewRouter = express.Router();

reviewRouter.get("/", authController.protect, reviewController.getAllReviews);
reviewRouter.post("/", authController.protect, reviewController.createReview);

module.exports = reviewRouter;
