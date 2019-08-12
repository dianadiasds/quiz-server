const express = require('express');
const {Router} = express;
const User = require('./model.js');

function factory (stream) {
    const userRouter = new Router();

    userRouter.post('/login', (request, response, next) =>
    User
        .create({
            name: request.body.name,
            password: request.body.password
        })
        .then(user => {response.send(user)})
        .catch(next)
    )
    return userRouter
}


module.exports = factory;
