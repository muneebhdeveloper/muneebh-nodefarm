const express = require("express");
const tourController = require("./../controllers/tourController");

const tourRouter = express.Router();

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
