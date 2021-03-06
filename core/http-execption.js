class HttpExecption extends Error{
  constructor (msg, code=10001, status=500){
    super()
    this.message = msg
    this.errorCode = code
    this.status = status
  }
}
class ParameterException extends HttpExecption{
  constructor (msg="参数异常", code=10002, status=412){
    super()
    this.message = msg
    this.errorCode = code
    this.status = status
  }
}
class AuthError extends HttpExecption{
  constructor (msg="拒绝访问", code=10003, status = 401){
    super()
    this.message = msg
    this.errorCode = code
    this.status = status
  }
}
class Success extends HttpExecption{
  constructor(msg='ok', code=200){
      super()
      this.message = msg
      this.errorCode = code
      // this.status = status
  }
}
class AuthFailed extends HttpExecption {
  constructor(msg, errorCode) {
    super()
    this.message = msg || '授权失败'
    this.errorCode = errorCode || 10004
    this.status = 401
  }
}
class Forbbiden extends HttpExecption {
  constructor(msg, errorCode) {
    super()
    this.message = msg || '禁止访问'
    this.errorCode = errorCode || 10006
    this.status = 403
  }
}
class LikeError extends HttpExecption {
  constructor(msg, errorCode) {
      super()
      this.status = 400
      this.message =  msg || "你已经点赞过"
      this.errorCode = errorCode || 60001
  }
}

class DislikeError extends HttpExecption {
  constructor(msg, errorCode) {
      super()
      this.status = 400
      this.message = msg || "你已取消点赞"
      this.errorCode = errorCode || 60002
  }
}
class notFound extends HttpExecption {
  constructor(msg, errorCode) {
      super()
      this.status = 404
      this.message = msg || "没有找到"
      this.errorCode = errorCode || 404
  }
}
module.exports = {
  HttpExecption,
  ParameterException,
  AuthError,
  Success,
  AuthFailed,
  Forbbiden,
  DislikeError,
  LikeError,
  notFound
}