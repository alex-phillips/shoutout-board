const Sequelize = require('sequelize')
const UserModel = require('../models/user')
const path = require('path')

const sequelize = new Sequelize(`sqlite:${path.join(__dirname, '/../db.sqlite')}`)

const User = UserModel(sequelize, Sequelize)

sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  User
}
