const Review = require("./../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

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
    const newReview = await Review.create({ user: req.user.id, ...req.body });

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
