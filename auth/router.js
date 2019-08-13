const { Router } = require('express')
const { toJWT, toData } = require('./jwt')
const {User} = require('../game/model')
const bcrypt = require('bcrypt');
 const auth=require('./middleware')

const router = new Router()

router.post('/login', (request, response,next)=>{
        const { body } = request;
        const { name } = body;
        const { password } = body;

        if(!name && !password){
            response.status(400).send({
                message: 'Please supply a valid name and password'
            })
        }
        console.log('name:',request.body.name )
        User
            .findOne({
                where: {
                name: request.body.name
                }
            })
            .then(entity => {
                if (!entity) {
                    response.status(400).send({
                        message: 'User with that name does not exist'
                })
                }

   
        if (bcrypt.compareSync(request.body.password, entity.password)) {
        response.send({
            jwt: toJWT({ userId: entity.id })
        })
        }
        else {
        response.status(400).send({
                message: 'Password was incorrect'
        })
        }
    })
  .catch(err => {
    console.error(err)
    response.status(500).send({
        message: 'Something went wrong'
    })
  })
})

module.exports = router