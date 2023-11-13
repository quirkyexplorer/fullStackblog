const express = require("express");
const app = express();
require("express-async-errors"); // this library removes all the try and catch
const cors = require("cors");
const usersRouter = require("./controllers/users");
const routes = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoUrl = config.MONGODB_URI;

logger.info("connecting to", mongoUrl);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor, routes);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
