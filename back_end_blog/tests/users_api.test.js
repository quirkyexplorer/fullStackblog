const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");

// a user can be created and then be able to login
// a user has to login first before being able to post 
// a user without being logged in is unable to post
// a user can be deleted
// a user can create their own blogs
// a user can delete their own blogs
// a user cannot delete another users blogs.

beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user  = new User({username: 'test', passwordHash }); // to test duplicate username
        await user.save();
    })

describe('when there is initially one user in db', () => {
    
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: 'quirkyDan',
            name: 'Daniel Segura',
            password: 'love2code'
        }

        await api 
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/);
        
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);

    });

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'test',
            name: 'daniel',
            password: 'salainen'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

          console.log(result);

        expect(result.body.error).toContain("username must be unique")
    });

});
