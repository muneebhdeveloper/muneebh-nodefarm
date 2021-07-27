const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  let tour = tours.filter((tour) => tour.id == req.params.id);

  if (tour.length) {
    res.status(200).json({
      status: "success",
      result: tour.length,
      data: {
        tours: tour,
      },
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "No tour found",
    });
  }
};

const addTour = (req, res) => {
  let newId = tours[tours.length - 1].id + 1;
  let newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    function (err) {
      if (!err) {
        res.status(201).json({
          status: "success",
          data: {
            tours: newTour,
          },
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Something went wrong",
        });
      }
    }
  );
};

const deleteTour = (req, res) => {
  let deletedTour = tours.filter((tour) => tour.id == req.params.id);
  let newToursArr = tours.filter((tour) => tour.id != req.params.id);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newToursArr),
    function (err) {
      if (!err) {
        res.status(201).json({
          status: "success",
          data: {
            deleted: deletedTour,
          },
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Parameter is wrong",
        });
      }
    }
  );
};

const updateTour = (req, res) => {
  let updatedTours = tours.map((tour) => {
    if (tour.id == req.params.id) {
      return {
        ...tour,
        ...req.body,
      };
    } else {
      return tour;
    }
  });

  let updatedTour = updatedTours.filter((tour) => tour.id == req.params.id);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    function (err) {
      if (!err) {
        res.status(201).json({
          status: "success",
          data: {
            updated: updatedTour,
          },
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Unable to update the tour",
        });
      }
    }
  );
};

module.exports = {
  getAllTours,
  getTourById,
  addTour,
  deleteTour,
  updateTour,
};
