const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

  // here we are saving each blog to the database, and holding until all objects are done.
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all notes are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog is within the return blogs", async () => {
  const response = await api.get("/api/blogs");

  const title = response.body.map((r) => r.title);
  expect(title).toContain("Go To Statement Considered Harmful");
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];
  // console.log(blogToView);
  // console.log(blogsAtStart[0]);
  const resultBlog = await api
    .get(`/api/blogs/${blogToView._id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  //const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

  expect(resultBlog.body._id).toEqual(blogToView._id.toHexString());
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToDelete = blogsAtStart[0];

  console.log(blogToDelete._id);
  await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "hola que tal",
    author: "daniel",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain("hola que tal");
});

test("a blog without title or url is not added", async () => {
  const newBlog = {
    author: "daniel",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  const newBlog2 = {
    title: "come on bro",
    author: "daniel",
    likes: 12,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  await api.post("/api/blogs").send(newBlog2).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});


test("creating a blog with no likes property defaults likes to 0", async () => {
    const newBlog = {
        title: "example",
        author: "daniel",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }

    await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)

    const blogsAtEnd = await helper.blogsInDb();
    
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0);
})

test("increases the number of likes of a post by 1", async () => {

    const blogsAtStart = await helper.blogsInDb();
    const likesStart  = blogsAtStart[blogsAtStart.length - 1].likes;
    const blogId = blogsAtStart[blogsAtStart.length - 1]._id.toHexString();

    const increaseLikes = () => likesStart + 1;

    const addLikes = {
        likes: increaseLikes()
    }

    await api
    .patch(`/api/blogs/${blogId}`)
    .send(addLikes)
    .expect(200)

    const blogsAtEnd = await helper.blogsInDb();
    const likesEnd  = blogsAtEnd[blogsAtEnd.length - 1].likes;
    
    expect(likesStart).toEqual(likesEnd-1);
}) 

afterAll(async () => {
  await mongoose.connection.close();
});
