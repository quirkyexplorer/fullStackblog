const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");

// a user can be created and then be able to login
// a user has to login first before being able to post 
// a user without a login token is unable to post
// 



beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user  = new User({username: 'Daniel', passwordHash });
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

    // test('creation fails with proper statuscode and message if username is already taken', async () => {
    //     const usersAtStart = await helper.usersInDb();

    //     const newUser = {
    //         username: 'root',
    //         name: 'Superuser',
    //         password: 'salainen'
    //     }

    //     const result = await api
    //       .post('/api/users')
    //       .send(newUser)
    //       .expect(400)
    //       .expect('Content-Type', /application\/json/)

    //     expect(result.body.error).toContain('expected `username` to be unique')
    // });

});
