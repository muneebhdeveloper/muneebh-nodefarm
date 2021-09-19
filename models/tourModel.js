const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name"],
      minLength: [10, "Tour name must be equal or larger than 10 characters"],
      maxLength: [40, "Tour name must be equal or shorter than 40 characters"],
      unique: true,
      trim: true,
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, "en-US", { ignore: " " });
        },
        message: "Tour name can only contains character",
      },
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have duration"],
      min: [1, "Duration must be equal or larger than 1"],
      max: [14, "Duration must be equal or shorter than 14"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a Group Size"],
      minlength: [2, "Group Size must be equal or larger than 2"],
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      min: [1, "Rating must be equal or above 1.0"],
      max: [5, "Rating must be equal or below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty either be 'easy', 'medium' or 'difficult'",
      },
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
      minlength: [1, "Price must not be 0 or less"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // (this) only works with New Document Creation
          return value < this.price;
        },
        message: "Price discount must be less than Actual Price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have some summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have Image Cover"],
    },
    images: [String],
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: Array,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Document Middleware
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("save", async function (next) {
  const guidePromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidePromises);

  next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ isSecret: { $ne: true } });
  next();
});

// Aggregation Middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
  next();
});

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
