const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.getUserAndTourId,
    authController.restrictTo("user", "admin"),
    reviewController.createReview
  );

reviewRouter
  .route("/:reviewId")
  .patch(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = reviewRouter;
