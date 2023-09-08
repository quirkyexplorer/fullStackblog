const blogsRouter = require("express").Router();
const jwt = require('jsonwebtoken');
const Blog = require("../models/blog");
const User = require("../models/user");

// the try and catch are kept for reference
// even thou they can be removed since the express-async-errors library is installed as dependency

// const getTokenFrom = request => {
//     const authorization = request.get('authorization');
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ','');
//     }
//     return null
// }


blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1});
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
  
  const token = request.token;

  try {

    const decodedToken = jwt.verify( token , process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id);
    
    if (!body.title || !body.url) {
        response.status(400).json({
        error: "title or url missing",
        });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes:  !body.likes ? 0 : body.likes,
        user: user.id
    });

    
        const result = await blog.save();
        user.blogs = user.blogs.concat(result._id);
        await user.save();

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

blogsRouter.patch("/:id", async (request, response, next) => {
    
    try {
        const updatedBlog = await Blog.findOneAndUpdate(
            { _id: request.params.id}, 
            request.body, 
            {new : true}
            );
        if ( !updatedBlog) {
            return response.status(404).json({ message: 'Blog not found' });
        }
        return response.json({ message: 'Blog updated successfully', resource: updatedBlog });

    } catch (exception) {
        next(exception);
    }
}) 

module.exports = blogsRouter;
