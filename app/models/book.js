const { sequelize } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const util = require('util')
const axios = require('axios')
const config = require('@config/index.js')
class Book extends Model {
  constructor(id){
    super()
    this.id = id
  }
  async detail (){
    const url = util.format(config.yushu.detailUrl, this.id)
    const detail = await axios.get(url)
    return detail.data
  }
  static async searchBook (q, start = 0, count = 10, summary = 1) {
    const url = util.format(config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const result = await axios.get(url)
    return result.data
  }
  static async getFavorCount (uid) {
    const count = await Favor.count({
      where:{
        type: 400,
        uid
      }
    })
    return count
  }
}
Book.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
},
fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
}
},{
  sequelize,
  tableName: 'book'
})
module.exports = {
  Book
}