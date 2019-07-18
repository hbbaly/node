const { Success } = require('../core/http-execption')
function success(msg,errorCode){
  throw new Success(msg, errorCode)
}

module.exports = {
  success
}