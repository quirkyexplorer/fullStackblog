const express = require("express");
const app = require("./app");
const cors = require("cors");
const routes = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
