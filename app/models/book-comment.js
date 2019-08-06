const {sequelize} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')

class Comment extends Model{
  static async getComments (id){
    const comments = await Comment.findAll({
      where: {
          book_id: id
      }
  })
  return comments
  }
}
Comment.init({
  content:Sequelize.STRING(12),
  nums:{
      type:Sequelize.INTEGER,
      defaultValue:0
  },
  book_id:Sequelize.INTEGER,
  // exclude:['book_id','id']
},{
  sequelize,
  tableName:'comment'
})
module.exports = {
  Comment
}