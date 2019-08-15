const Sequelize = require('sequelize');
const {User, Game, Question} = require('./model');
const {Router} = require('express');
const bcrypt = require('bcrypt');

const Op = Sequelize.Op

function factory (stream, update) {
    const router = new Router();

    router.post('/user', (request, response, next) => {
        console.log('REQUEST_BODY', request.body);
        User
            .create({
                name: request.body.name,
                password: bcrypt.hashSync(request.body.password, 10),
            })
            .then(user => {
                response.send(user)
            })
            .catch(next)
    });

    router.put('/start/:gameId', async (request, response, next) => {
        const count = await User
            .update({score: 0}, {where: {gameId: request.params.gameId}})

        await update()

        response.send({ count })
    });

    router.put('/join/:gameId', async (request, response, next) => {
        const { userId } = request.body
        const { gameId } = request.params

        const user = await User.findByPk(userId)
        user.update({ gameId })

        await update()

        response.send(user)
    });

    router.post('/game',
        async (request, response, next) => {

            const gameQuestion = await Question.findOne({order: [Sequelize.fn('RANDOM')], limit: 1});

            console.log('gameQuestion test:', gameQuestion)

            const game = await Game.create({questionId: gameQuestion.id})

            await update()

            response.send(game)
        });

    router.put('/answer/:gameId', async (request, response, next) => {
        const { userId, answer } = request.body;
        console.log("userId test:", userId)
        console.log('answer test:', answer);

        try {
            const game = await Game.findByPk(request.params.gameId, {include: [Question]});
            // console.log('game test:', game.dataValues);

            const user = await User.findByPk(parseInt(userId));
            console.log('user test:', user.dataValues);

            const userUpdate = {answered: true}

            const correct = game.question.answer[0] === answer;
            console.log('correct test:', correct)
            if (correct) {
                userUpdate.score = user.score + 1
            }
            await user.update(userUpdate)

            const updatedGame = await Game.findByPk(request.params.gameId, {include: [User] });

            const allAnswered = updatedGame.users.every(user => user.answered)
            console.log('allAnswered test:', allAnswered)
            if (allAnswered) {
                const question = await Question.findOne({
                    where: {
                        id: {
                            [Op.not]: game.questionId
                        }
                    }
                })
                console.log('question test:', question.dataValues)
                await game.setQuestion(question)

                await User.update(
                    {answered: false},
                    {where: {gameId: game.id}}
                )
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
