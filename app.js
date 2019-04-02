const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const cors = require('cors')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const shoutoutsRouter = require('./routes/shoutouts')

require('dotenv').config()

const config = require('./config.json')

const Twitter = require('./plugins/twitter')

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production'

var app = express()

app.use(logger('dev'))
app.use(cors({
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'pwa/www')))
app.use(express.static(path.join(__dirname, 'kiosk')))
app.use(session({ secret: 'shoutout-board', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/shoutouts', shoutoutsRouter)

require('./config/passport')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)

  res.json(err)
})

let runningPlugins = {}
for (let identifier in config.plugins) {
  if (!config.plugins[identifier].enabled) {
    continue
  }

  console.log(`Initializing plugin ${identifier}`)
  switch (config.plugins[identifier].type) {
    case 'twitter':
      runningPlugins[identifier] = new Twitter('twitter-wral', {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      })

      runningPlugins[identifier].stream(config.plugins[identifier].params)
      break
  }
}

module.exports = app
