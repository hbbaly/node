const { sequelize } = require('../../core/db')

const { Sequlize, Model } = require('sequelize')

class User extends Model {

}
// 初始化用户属性
User.init({
  id: {
    type: Sequlize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  nickName: Sequlize.STRING,
  password: Sequlize.STRING,
  email: Sequlize.STRING,
  openId: {
    type: Sequlize.STRING(64), // 最长64
    unique: true
  }
},{
  sequelize,
  tableName: 'user'
})