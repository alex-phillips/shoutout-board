const bcrypt = require('bcrypt')

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

  return user
}
