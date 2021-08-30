const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const tourRouter = require("./routes/tourRouter");

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

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/tours", tourRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log(`App is running on http://localhost:${PORT}`);
});
