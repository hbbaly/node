const { sequelize } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Favor } = require('./favor')
class HotBook extends Model {
  static async getHotAll () {
    const ids = []
    const books = await HotBook.findAll({
      order:['index']
    })
    books.forEach(book => {
      ids.push(book.id)
    })
    // 去查询favor表
    const favors = await Favor.findAll({
      where:{
        art_id: {
          [Op.in]: ids
        },
        type: 400,
      },
      group: ['art_id'],
      attributes:['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
    })
    console.log(favors, '----------------')
    books.forEach(book => {
      let count = 0
      favors.forEach(favor => {
        if (book.id === favor.art_id) count = favor.get('count')
      })
      book.setDataValue('fav_nums', count)
    })
    return books
  }
}
HotBook.init({
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING
},{
  sequelize,
  tableName: 'hot_book'
})
module.exports = {
  HotBook
}