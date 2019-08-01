const {LinValidator, Rule} = require('../core/validator.js')
const { User } = require('../app/models/user.js')
const {LoginType, ArtType} = require('./enum.js')
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
class TokenValidator extends LinValidator {
  constructor () {
    super()
    this.account = [
      new Rule('isLength','不符合账号规则', {
        min: 4,
        max: 32
      })]
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128
    })
    ]
  }
  validateLoginType (vals) {
    if (!vals.body.type) throw new Error('缺少type')
    if (!LoginType.isThisType(LoginType, vals.body.type)) throw new Error('type不合法')
  }
}
function checkLikeType (vals){
  let type = vals.body.type || vals.path.type || false
  if (!type) throw new Error('缺少type')
  type = parseInt(type)
  if (!LoginType.isThisType(type)) throw new Error('type不符合条件')
}
class LikeValidator extends LinValidator {
  constructor (){
    super ()
    this.validateType = checkArtType
  }
}
function checkArtType (vals){
  let type = vals.body.type || vals.path.type || false
  if (!type) throw new Error('缺少type')
  type = parseInt(type)
  if (!ArtType.isThisType(type)) throw new Error('type不符合条件')
}
class LikeFavorType  extends LikeValidator{
  constructor (){
    super()
    this.validateType = checkArtType
  }
}
module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  LikeValidator,
  LikeFavorType
}