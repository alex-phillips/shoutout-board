const ejwt = require('express-jwt')
const jwt = require('jsonwebtoken')

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1]
  }

  return null
}

const auth = {
  required: ejwt({
    secret: 'secret',
    userProperty: 'authUser',
    getToken: getTokenFromHeaders
  }),
  optional: ejwt({
    secret: 'secret',
    userProperty: 'authUser',
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  }),
  generateJWT (user) {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    return jwt.sign({
      id: user.id,
      username: user.username,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, 'secret')
  },
  authJSON (user) {
    return {
      id: user.id,
      username: user.username,
      token: this.generateJWT(user)
    }
  }
}

module.exports = auth
