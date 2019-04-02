module.exports = (sequelize, type) => {
  let shoutout = sequelize.define('shoutout', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: type.STRING
    },
    identifier: {
      type: type.STRING
    },
    body: {
      type: type.STRING,
      unique: true
    },
    deleted: {
      type: type.BOOLEAN,
      defaultValue: 0
    }
  })

  return shoutout
}
