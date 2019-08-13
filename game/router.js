// const express = require('express');
// const {Router} = express;
// const User = require('./model.js');

// function factory (stream) {
//     const userRouter = new Router();

//     userRouter.post('/login', (request, response, next) =>
//     User
//         .create({
//             name: request.body.name,
//             password: request.body.password
//         })
//         .then(user => {response.send(user)})
//         .catch(next)
//     )
//     return userRouter
// }


// module.exports = factory;


const User = require ('./model')
const { Router } = require('express');
const bcrypt = require('bcrypt')
const router = new Router()

router.post('/login', (request, response,next)=>{
    console.log('REQUEST_BODY',request.body)
    User
        .create({
            name: request.body.name,
            password: bcrypt.hashSync(request.body.password, 10),
        })
        .then(user => response.send(user))
        .catch(next)
})
module.exports=router