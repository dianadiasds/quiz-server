const Sequelize = require('sequelize');
const db = require('../db.js');
const questions = require('../questions.json')

const Game = db.define(
  'game',
  {
    winnerId: Sequelize.INTEGER
  }
);
const User = db.define(
    'user',
    {
        name: Sequelize.STRING,
        password: Sequelize.STRING,
        score: Sequelize.INTEGER,
        answered: Sequelize.BOOLEAN
    }
);
const Question = db.define(
    'question',
    {
        question: Sequelize.STRING,
        answer: Sequelize.ARRAY(Sequelize.STRING)
    }
);
User.belongsTo(Game);
Game.belongsTo(Question)
Game.hasMany(User)

async function createQuestions () {
    const count = await Question.count()

    console.log('count test:', count)

    if (!count) {
        await Question.bulkCreate(questions)
    }
}

db
    .sync({ force: false })
    .then(createQuestions)
    .then(() => console.log('Database synced'))

module.exports = {User, Question, Game};
