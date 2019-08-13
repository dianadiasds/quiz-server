const sequelize = require('sequelize')
const {User, Game, Question} = require ('./model')
const { Router } = require('express');
const bcrypt = require('bcrypt')
const router = new Router()

// const questions = require('../questions.json')
// questions.map(question => Question.create(question))

router.post('/user', (request, response,next)=>{
    console.log('REQUEST_BODY',request.body)
    User
        .create({
            name: request.body.name,
            password: bcrypt.hashSync(request.body.password, 10),
        })
         .then(user => {response.send(user)})
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

router.put ('/user/:gameId/answer', async (request, response, next) => {
    const { gameId, userId, answerText } = request.body
    console.log(gameId, userId, answerText)
    const game = await Game.findByPk(gameId)
    console.log(game.dataValues)
    const user = User.findByPk(userId)
    console.log(user.dataValues)
    const correct = Question.answer[0] === answerText
    
     if (correct) {
         user.update({ user = user.score + 1, answered: true })
         const others = game.users.filter(user => user.id !== userId)
         const allAnswered = game.users.every(user => user.answered)
     }
     if (allAnswered) {
         const question = Question.findOne({ order: [sequelize.fn('RANDOM')] })
         game.update({question})
         User.update({ answered: false }, { where: { gameId }})
    }
    response.send('hi')
})

module.exports=router