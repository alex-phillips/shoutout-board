module.exports = (sequelize, type) => {
  let setting = sequelize.define('setting', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    identifier: {
      type: type.STRING
    },
    value: {
      type: type.STRING
    }
  })

  return setting
}
