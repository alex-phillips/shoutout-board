const express = require('express')
const router = express.Router()
const { User } = require('../config/db')
const passport = require('passport')
const auth = require('./auth')

/* GET users listing. */
router.get('/', auth.required, (req, res, next) => {
  console.log(req)

  User.findAll().then(users => res.json(users))
})

router.post('/', auth.optional, (req, res, next) => {
  console.log(req.body)
  User.create(req.body)
    .then(user => res.json(user))
})

router.post('/login', auth.optional, (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (user && user.validatePassword(req.body.password)) {
        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
          if (err) {
            return next(err)
          }

          if (passportUser) {
            return res.json({ user: auth.authJSON(passportUser) })
          }

          return res.status(400).json({ error: true })
        })(req, res, next)
      }
    })
})

module.exports = router
