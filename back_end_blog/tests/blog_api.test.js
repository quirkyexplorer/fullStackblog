const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const Blog = require("../models/blog");

// a blog can only be created by a logged in user
// in order to view a blog, a user must be logged in
// in order to delete a blog , user needs to be the owner


beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

  // here we are saving each blog to the database, and holding until all objects are done.
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('testing general creation of blogs' , () => {
    it("knows blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }, 100000);

    it("knows all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    it("knows a specific blog is within the return blogs", async () => {
    const response = await api.get("/api/blogs");

    const title = response.body.map((r) => r.title);
    expect(title).toContain("Go To Statement Considered Harmful");
    });

    it("tests if a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];
    console.log(blogToView.id);
    
    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
        console.log('result', resultBlog.body.id);
        console.log('blogtoview', blogToView.id);

    expect(resultBlog.body.id).toEqual(blogToView.id);
    });
});



describe("testing with authorized users using blogs functionality", () => {

    let token;
    let userId;

    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});
        const newUser = {
            username: 'quirkyDan',
            name: 'Miro',
            password: 'love2code'
        } 
        
        userResponse = await api.post('/api/users').send(newUser);
        
        const user = userResponse.body;

        const loginResponse = await api.post('/api/login').send({
            username: newUser.username,
            password: newUser.password,
        });

        token = loginResponse.body.token

        userId = user.id

    });

    it("tests a valid blog can be added", async () => {
        const newBlog = {
            title: "hola que tal",
            author: "daniel",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            user:  userId,
        };

        await api
            .post("/api/blogs")
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        });

    it("tests that a blog without title or url is not added", async () => {
        const newBlog = {
            author: "daniel",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            user: userId,
        };

        const newBlog2 = {
            title: "come on bro",
            author: "daniel",
            likes: 12,
            user: userId,
        };

        await api.post("/api/blogs")
                 .set('Authorization', `Bearer ${token}`)
                 .send(newBlog)
                 .expect(400);
        await api.post("/api/blogs")
                 .set('Authorization', `Bearer ${token}`)
                 .send(newBlog2)
                 .expect(400);

    });

    it("tests an authorized user can delete a blog post", async () => {
    
        const newBlog = {
            title: 'My Test Blog',
            author: 'Daniel Segura',
            url: 'https://example.com',
            likes: 200,
            user: userId,
        }

        const createBlogResponse = await api
            .post("/api/blogs")
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog);
        

        const blogToDelete = createBlogResponse.body;

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set(`Authorization`, `Bearer ${token}`)
            .expect(204);

    });


    it("creates a blog with no likes property and defaults likes to 0", async () => {
        const newBlog = {
            title: "example",
            author: "daniel",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            user: userId
        }

        await api
        .post("/api/blogs")
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

        const blogsAtEnd = await helper.blogsInDb();
        
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0);
    })

    it("increases the number of likes of a post by 1", async () => {

        const newBlog = {
            title: "example",
            author: "daniel",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            user: userId
        }

        await api
        .post("/api/blogs")
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

        const blogsAtStart = await helper.blogsInDb();
        const likesStart  = blogsAtStart[blogsAtStart.length - 1].likes;
        const blogId = blogsAtStart[blogsAtStart.length - 1].id;

        const increaseLikes = () => likesStart + 1;

        const addLikes = {
            likes: increaseLikes()
        }

        await api
        .patch(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(addLikes)
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb();
        const likesEnd  = blogsAtEnd[blogsAtEnd.length - 1].likes;
        expect(likesStart).toEqual(likesEnd-1);
    }) 
});

afterAll(async () => {
  await mongoose.connection.close();
});
