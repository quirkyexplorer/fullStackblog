const express = require('express')
const app = express();
const cors = require('cors');
const routes = require("./controllers/Routes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);