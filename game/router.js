const Sequelize = require('sequelize');
const {User, Game, Question} = require('./model');
const {Router} = require('express');
const bcrypt = require('bcrypt');
const { toData } = require('../auth/jwt')
const auth = require('../auth/middleware');


const Op = Sequelize.Op;

function factory(stream, update) {
  const router = new Router();

  router.post('/user', (request, response, next) => {
    console.log('REQUEST_BODY', request.body);
    User
      .create({
      name: request.body.name,
      password: bcrypt.hashSync(request.body.password, 10)
    })
      .then(user => {
        response.send(user)
      })
      .catch(next)
  });

  router.put('/start/:gameId', auth, async(request, response, next) => {
    const count = await User.update({
      score: 0
    }, {
      where: {
        gameId: request.params.gameId
      }
    })

    await update()

    response.send(count)
  });

  router.put('/join/:gameId', auth, async (request, response, next) => {
    const {gameId} = request.params
    const {user} = request;

   await user.update({gameId: gameId})
   const users = await User.findAll({
    where: {
      gameId: gameId
    }
  })


    await update()
    response.send({count: users.length})
  });

  router.post('/game', auth, async(request, response, next) => {

    const game = await Game.create({ questionId: 1 })

    await update()

    response.send(game)
  });

  router.put('/answer/:gameId', auth, async(request, response, next) => {
    const {jwt, answer} = request.body;
    console.log("userId test:", jwt)
    console.log('answer test:', answer);

    const { userId } = toData(jwt)

    try {
      const game = await Game.findByPk(request.params.gameId, {include: [Question]});
      // console.log('game test:', game.dataValues);
        const user = await User.findByPk(parseInt(userId));
        console.log('user test:', user.dataValues);

      const userUpdate = {answered: true};

      const correct = game.question.answer[0] === answer;
      console.log('correct test:', correct);
      if (correct) {
          userUpdate.score = user.score + 1
      }
      await user.update(userUpdate);

      const updatedGame = await Game.findByPk(request.params.gameId, {include: [User]});

      const allAnswered = updatedGame.users.every(user => user.answered);
      console.log('allAnswered test:', allAnswered);
      if (allAnswered) {
        if (game.questionId === 10) {
            const users = await User.findAll({ where: { gameId: game.id } })
            let winner = { score: -1 }

            users.map(user => {
                winner = user.score > winner.score
                    ? user
                    : winner
            })

            await game.update({ winnerId: winner.id })
          } else {
              let nextQuestion = game.questionId + 1

              const question = await Question.findOne({
                  where: {
                      id: nextQuestion
                  }
              });

              await game.setQuestion(question);

              await User.update(
                {answered: false},
                {where: {gameId: game.id}}
              )
          }
      }

      await update()
    } catch (error) {
      console.log("error test:", error)
    }

    response.send('hi')
  });

  return router
}

module.exports = factory;
