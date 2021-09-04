const express = require("express");
const tourController = require("./../controllers/tourController");

const tourRouter = express.Router();

tourRouter
  .route("/top-5")
  .get(tourController.aliasTopFive, tourController.getAllTours);

tourRouter.route("/tours-stats").get(tourController.getToursStats);

tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.addTour);

tourRouter
  .route("/:id")
  .get(tourController.getTourById)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = tourRouter;
