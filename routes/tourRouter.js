const express = require("express");
const tourController = require("./../controllers/tourController");

const tourRouter = express.Router();

tourRouter.get("/", tourController.getAllTours);
tourRouter.get("/:id", tourController.getTourById);
tourRouter.post("/", tourController.addTour);
tourRouter.delete("/:id", tourController.deleteTour);
tourRouter.put("/:id", tourController.updateTour);

module.exports = tourRouter;
