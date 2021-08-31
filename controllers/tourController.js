const Tour = require("./../models/tourModel");

const getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // Build the query
    const dbQuery = { ...req.query };
    const excludedKeys = ["page", "sort", "limit", "fields"];
    excludedKeys.forEach((el) => delete dbQuery[el]);

    // Advanced Filtering
    let dbQueryFilter = JSON.stringify(dbQuery);
    dbQueryFilter = dbQueryFilter.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    dbQueryFilter = JSON.parse(dbQueryFilter);

    console.log(dbQueryFilter);
    // Pass the query
    const query = Tour.find(dbQueryFilter);

    // Execute the query
    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      results: tour.length,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

const addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      deleted: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      updatedTour: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  addTour,
  deleteTour,
  updateTour,
};
