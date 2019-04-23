const express = require('express')
const router = express.Router()
const { Setting } = require('../config/db')
const passport = require('passport')
const auth = require('./auth')
const socket = require('../socket')

router.get('/', auth.optional, (req, res, next) => {
  Setting.findAll()
    .then(settings => res.json(settings))
})

router.post('/', auth.required, (req, res, next) => {
  Setting.create({
    identifier: req.body.identifier,
    value: req.body.value
  }).then(setting => res.json(setting))
})

router.put('/', auth.required, (req, res, next) => {
  Setting.findOne({
    where: {
      identifier: req.body.identifier
    }
  }).then(setting => {
    return setting.update({
      value: req.body.value
    })
      .then(() => {
        socket.emit('settings_updated')
        res.json(setting)
      })
  })
})

module.exports = router
