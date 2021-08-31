const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    startDates: [Date],
  },
  {
    timestamps: true,
  }
);

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
