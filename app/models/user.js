const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

class User extends Model {

}
// 初始化用户属性
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  nickName: Sequelize.STRING,
  password: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128),
    unique: true
  },
  openId: {
    type: Sequelize.STRING(64), // 最长64
    unique: true
  }
},{
  sequelize,
  tableName: 'user'
})
module.exports = {
  User
}