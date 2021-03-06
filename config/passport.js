const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('./db')

passport.use(new LocalStrategy({
  username: 'user[username]',
  password: 'user[password]'
}, (username, password, done) => {
  User.findOne({
    where: {
      username: username
    }
  })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'username or password': 'is invalid' } })
      }

      return done(null, user)
    }).catch(done)
}))
