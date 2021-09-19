const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const mongoose = require("mongoose");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

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

app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many request for this IP, Please try again in 1 hour",
});

app.use("/api", limiter);

// Middleware to prevent NoSQL Query Injections
app.use(mongoSanitize());

// Middleware to prevent cross site scripting
app.use(xss());

// Middleware to prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find any route for ${req.originalUrl} on this server`,
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log(`App is running on http://localhost:${PORT}`);
});
