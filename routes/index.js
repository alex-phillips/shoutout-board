var express = require('express')
var router = express.Router()
var path = require('path')
var auth = require('./auth')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../pwa/www/index.html'))
})

router.get('/ping', auth.required, (req, res, next) => {
  return res.json({ success: true })
})

module.exports = router
