const express = require('express')
const cors = require('cors')
const middleware = cors()

// const questions = require('questions.js)
// const Question = require('./question/model')
const { User, Game, Question } = require('./game/model')
const app = express()

// Question.bulkCreate(questions)

const Sse = require('json-sse')
const stream = new Sse()

const bodyParser = require('body-parser')
const authRouter= require('./auth/router')
const parserMiddleware = bodyParser.json()

const gameFactory = require('./game/router.js')
//const userRouter = userFactory(stream)


const port = process.env.PORT || 5000
app.use(middleware)
app.use(parserMiddleware)

async function serialize () {
  try {
    const games = await Game
      .findAll({include: [{model: User, as: 'users'}, Question]})

    return JSON.stringify(games)
  } catch(error) {
    console.log('error test:', error)
  }
}

async function update () {
    const data = await serialize()
    stream.send(data)
}


app.get('/game',
    async (request, response) => {
        const data = await serialize()

        stream.updateInit(data)
        stream.init(request, response)
    }
)

app.use(authRouter)

const gameRouter = gameFactory(stream, update)
app.use(gameRouter)


app.listen(
    port,
    () => console.log(`Listening on :${port}`)
)

