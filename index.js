const express = require("express");
const tourRouter = require("./routes/tourRouter");

const app = express();

app.use(express.json());

app.use("/api/v1/tours", tourRouter);

app.listen(8000, function () {
  console.log("App is running");
});
