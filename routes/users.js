const express = require('express')
const router = express.Router()
const { User } = require('../config/db')
const passport = require('passport')
const auth = require('./auth')

/* GET users listing. */
router.get('/', auth.required, (req, res, next) => {
  User.findOne({
    where: {
      id: req.authUser.id
    }
  }).then(users => res.json(users))
})

router.post('/', auth.optional, (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
})

router.post('/login', auth.optional, (req, res, next) => {
  req.body.username = req.body.username.toLowerCase()
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

      res.status(401).json({ error: 'Your username or password is incorrect' })
    })
    .catch(() => {
      res.status(401).json({ error: 'Your username or password is incorrect' })
    })
})

module.exports = router
