const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title:1, author:1, likes:1, url:1});
    response.json(users);
});   

usersRouter.post('/', async (request, response) => {
    const { username, name, password} = request.body;

    if (!username || !password) {
        response.status(400)
          .json({error: "missing username or password"});
    }

    if (username.length < 3 || password < 3) {
        response.status(400)
          .json({error: "username and password must be more than 3 characters long"});
    }

    const existingUser = await User.findOne({ username });
    if ( existingUser ) {
       return response.status(400).json({error: "username must be unique"});
    }
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username, 
        name,
        passwordHash
    })

    const savedUser = await user.save();

    response.status(201).json(savedUser);
})


module.exports = usersRouter;  