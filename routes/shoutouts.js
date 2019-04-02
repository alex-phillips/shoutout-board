const express = require('express')
const router = express.Router()
const { Shoutout } = require('../config/db')
const auth = require('./auth')
const socket = require('../socket')
const Sequelize = require('sequelize')

/* GET users listing. */
router.get('/', auth.optional, (req, res, next) => {
  let where = {}

  if (!req.authUser) {
    where.deleted = 0
  }

  Shoutout.findAll({
    where: where,
    limit: 20,
    order: [
      ['id', 'DESC']
    ]
  }).then(shoutouts => res.json(shoutouts))
})

router.get('/page/:page', auth.optional, (req, res, next) => {
  let limit = 20
  let offset = limit * (req.params.page - 1)
  let where = {}

  if (!req.authUser) {
    where.deleted = 0
  }

  Shoutout.findAll({
    where: where,
    limit: limit,
    offset: offset,
    order: Sequelize.literal('id DESC')
  })
    .then(shoutouts => res.json(shoutouts))
})

router.get('/:type', (req, res, next) => {
  Shoutout.findAll({
    where: {
      type: req.params.type
    }
  })
    .then(shoutouts => res.json(shoutouts))
})

router.get('/:type/:identifier', (req, res, next) => {
  Shoutout.findAll({
    where: {
      type: req.params.type,
      identifier: req.params.identifier
    }
  })
    .then(shoutouts => res.json(shoutouts))
})

router.get('/:type/:identifier/:id', (req, res, next) => {
  Shoutout.findOne({
    where: {
      id: req.params.id,
      type: req.params.type,
      identifier: req.params.identifier
    }
  })
    .then(shoutouts => res.json(shoutouts))
})

router.delete('/:type/:identifier/:id', auth.required, (req, res, next) => {
  Shoutout.update(
    {
      deleted: true
    },
    {
      where: {
        id: req.params.id,
        type: req.params.type,
        identifier: req.params.identifier
      }
    }
  )
    .then(() => {
      socket.emit('shoutout-delete', req.params.id)
      return res.json({
        success: true
      })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/', auth.optional, (req, res, next) => {
  Shoutout.create(req.body)
    .then(shoutout => {
      socket.emit('shoutout', shoutout)
      res.json(shoutout)
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: true, message: 'This looks like a duplicate shoutout. Please try again.' })
      } else {
        res.status(500).json({ error: true, message: 'An unknown error occured. Please try again later.' })
      }
    })
})

module.exports = router
