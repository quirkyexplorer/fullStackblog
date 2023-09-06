const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true    
},
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = mongoose.model("Blog", blogSchema);