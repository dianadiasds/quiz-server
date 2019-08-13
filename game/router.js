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
const sequelize = require('sequelize')
const {User, Game, Question} = require ('./model')
const { Router } = require('express');
const bcrypt = require('bcrypt')
const router = new Router()

const questions = require('../questions.json')
questions.map(question => Question.create(question))

router.post('/user', (request, response,next)=>{
    // how to test:
    // http POST /user name=rein password=1234
    // check if the route works and if we have a request body
    console.log('REQUEST_BODY',request.body)
    // create a user using request.body.name and request body possword (has the password for secutiry)
    User
        .create({
            name: request.body.name,
            password: bcrypt.hashSync(request.body.password, 10),
        })
         .then(user => {
             console.log(user)
             response.send(user)
         })
         .catch(next)
})

router.put('/user/:gameId',(request, response,next)=>{
   User
   .update({ score: 0 }, { where: { gameId: request.params.gameId }})
})

router.post ('/game', 
async (request, response, next) => {

    const gameQuestion = await Question.findOne({ order: [sequelize.fn('RANDOM')], limit: 1 })

    const game = await Game.create({ questionId: gameQuestion.id })

    response.send(game)
})

module.exports=router
