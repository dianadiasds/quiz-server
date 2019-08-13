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

const {User, Game, Question} = require ('./model')
const { Router } = require('express');
const bcrypt = require('bcrypt')
const router = new Router()

router.post('/user', (request, response,next)=>{
    console.log('REQUEST_BODY',request.body)
    User
        .create({
            name: request.body.name,
            password: bcrypt.hashSync(request.body.password, 10),
        })
        .then(user => response.send(user))
        .catch(next)
})
router.put('/user/:gameId',(request, response,next)=>{
    console.log('HELLO?')
   User
   .update({ score: 0 }, { where: { gameId: request.params.gameId }})
}) 

router.put('/user/answer',(request, response,next)=>{
    const { gameId, userId, answerText } = request.body
    Game.findByPk(gameId)
    User.findByPk(userId)
    const correct = game.answer[0] === answerText
    if (correct) {
        User.update({score: score + 1, answered: true })
    }
        const others = game.users.filter(user => user.id !== userId)
        const allAnswered = game.users.every(user => user.answered)
        if (allAnswered) {
            const question = Question.findByPk()
            game.update({question})
        }
})
module.exports=router