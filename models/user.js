const bcrypt = require('bcrypt')
const jwt = require('express-jwt')

module.exports = (sequelize, type) => {
  let user = sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: type.STRING,
      unique: true
    },
    password: {
      type: type.STRING,
      allowNull: false,
      set (val) {
        this.setDataValue('password', bcrypt.hashSync(val, 10))
      }
    }
  })

  user.prototype.validatePassword = function (check) {
    return bcrypt.compareSync(check, this.password)
  }

  user.prototype.generateJWT = function () {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, 'secret')
  }

  user.prototype.toAuthJSON = function () {
    return {
      id: this.id,
      username: this.username,
      token: this.generateJWT()
    }
  }

  return user
}
