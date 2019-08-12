const express = require('express')
// const questions = require('questions.js)
// const Question = require('./question/model')
const app = express()

// Question.bulkCreate(questions)

const Sse = require('json-sse')
const stream = new Sse()

const bodyParser = require('body-parser')
const parserMiddleware = bodyParser.json()

const userFactory = require('./game/router.js')
const userRouter = userFactory(stream)
app.use(userRouter)

const port = process.env.PORT || 5000

app.use(parserMiddleware)
app.use(userRouter)


app.get('/game',
    async (request, response) => {
    const games = await Game
        .findAll( {include: [User]})
    const data = JSON.stringify(games)
        stream.updateInit(data)
        stream.init(request, response)
})

app.listen(
    port,
    () => console.log(`Listening on :${port}`)
)

