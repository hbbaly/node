const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')
const { AuthFailed } = require('../../core/http-execption')
class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new AuthFailed('账号不存在')
        }
        // user.password === plainPassword
        const correct = bcrypt.compareSync(plainPassword, user.password)

        if(!correct){
            throw new AuthFailed('密码不正确')
        }
        return user
    }
    // 检查数据库里面有没有已经存在用户
    static async getUserByOpenId (openid) {
      const user = await User.findOne({
        where: {
          openid
        }
      })
      return user
    }
    static async createUserByOpenid (openid) {
      return await User.create({
        openid
      })
    }
}
// 初始化用户属性
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  nickName: Sequelize.STRING,
  password: {
    type:Sequelize.STRING,
    set (val) {
      const salt = bcrypt.genSaltSync(10)
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue('password', pwd)
    }
  },
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