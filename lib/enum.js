
const LoginType = {
  USER_MINI_PROGRAM:100,
  USER_EMAIL:101,
  USER_MOBILE:102,
  ADMIN_EMAIL:200,
  isThisType
}
function isThisType(object, val){
  return Object.values(object).includes(val)
}
module.exports = {
  LoginType
}