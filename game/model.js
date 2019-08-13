const Sequelize = require('sequelize')
const db = require('../db.js')

const Game = db.define(
    'game',
    {
        
    }
    
)
const User = db.define(
    'user',
    {
        name: Sequelize.STRING,
        password: Sequelize.STRING,
        score: Sequelize.INTEGER,
        answered: Sequelize.BOOLEAN
    }
)
const Question = db.define(
    'question',
    {
        question: Sequelize.STRING,
        answer: Sequelize.ARRAY(Sequelize.STRING)
    }
)
User.belongsTo(Game)
Game.hasOne(Question)
Game.hasMany(User)

module.exports = {User, Question, Game}
