const {LinValidator, Rule} = require('../core/validator.js')
const { User } = require('../app/models/user.js')
class PositiveIntegerValidator extends LinValidator {
  constructor() {
      super()
      this.id = [
          new Rule('isInt', '需要是正整数', {
              min: 1
          }),
      ]
  }
}
class RegisterValidator extends LinValidator {
  constructor () {
    super()
    this.email = [
      new  Rule('isEmail', '邮箱不符合规范')
    ]
    this.nickName = [
      new Rule('isLength', '昵称不符合规范', {
        min: 2,
        max: 20
      })
    ]
    this.password = [
      new Rule('isLength', '密码长度不符合规范', {
        min: 8,
        max: 20
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    this.password2 = this.password
  }
  validatePassword (vals) {
    const { password, password2 } = vals.body
    if (password !== password2) throw new Error('密码不一致')
  }
  async validateEmail (vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (user) {
      throw new Error('email已经存在')
    }
  }
}
module.exports = {
  PositiveIntegerValidator,
  RegisterValidator
}