const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review should not be empty"],
    },
    rating: {
      type: Number,
      min: [1.0, "Rating must be atleast 1.0"],
      max: [5.0, "Rating must be shorter than 5.0"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review belong to the user"],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review belong to the tour"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
