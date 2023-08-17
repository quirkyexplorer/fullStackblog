const Blog = require("./models/blog")
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require("./utils/logger");
require("dotenv").config();
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
  logger.info("connected to MongoDb");
}).catch((error) => {
  logger.error("error connecting", error.message);
});


app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})