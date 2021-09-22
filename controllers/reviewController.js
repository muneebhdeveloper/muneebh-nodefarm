const Review = require("./../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong, Please try again",
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong, Please try again",
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.find({
      user: req.user.id,
    }).findByIdAndUpdate(req.params.reviewId, req.body);

    res.status(200).json({
      status: "success",
      data: {
        review: updatedReview,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong, Please try again",
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.find({
      user: req.user.id,
    }).findByIdAndDelete(req.params.reviewId);

    res.status(200).json({
      status: "success",
      data: {
        data: deletedReview,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong, Please try again",
    });
  }
};
