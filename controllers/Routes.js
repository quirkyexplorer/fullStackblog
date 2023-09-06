const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// the try and catch are kept for reference and education 
// even thou they can be removed with express-async-errors library
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end();
    }
  }
  catch(exception) {
    next(exception);
  }
  
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.title ) {
    response.status(400).json({
      error: "title missing",
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes:  !body.likes ? 0 : body.likes
  });

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
