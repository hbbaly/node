const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 自定义异常错误信息包括：
    // {
    //   error_code: // 错误对应状态码
    //   error_status: // http状态码
    //   request-url: // 请求url
    //   error_message: // 请求错误信息
    // }
    console.log(error, 'error')
    if (error.errorCode){
      ctx.body = {
        code: error.errorCode,
        msg: error.message,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.status
    } else {
      ctx.body = {
        msg: 'we made a mistake O(∩_∩)O~~',
        error_code: 999,
        request:`${ctx.method} ${ctx.path}`
    }
    ctx.status = 500
    }
  }
}
module.exports = catchError