const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel");
const User = require("./../../models/userModel");
const Review = require("./../../models/reviewModel");

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

// const data = JSON.parse(
//   fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
// );
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log("Tours successfully imported");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Tours successfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}
