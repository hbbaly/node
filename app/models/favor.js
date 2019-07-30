const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')
const { LikeError, DislikeError} = require('../../core/http-execption')
const { Art } = require('./art')
class Favor extends Model {
  static async like(art_id, type, uid){
    // 数据库中存不存在
    // 首先插入favor一个数据
    // 更新对应表中的fav_nums
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if (favor) {
      throw new LikeError('')
    }
    return sequelize.transaction(async t => {
      await Favor.create({
        art_id,
        type,
        uid
      },{
        transaction: t
      })
      const art = await Art.getData(type, art_id)
      await art.increment('fav_nums', {
        by: 1,
        transaction: t
      })
    })
  }
  static async disLike(art_id, type, uid){
    // 数据库中存不存在
    // 首先插入favor一个数据
    // 更新对应表中的fav_nums
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if (!favor) {
      throw new DislikeError()
    }
    return sequelize.transaction(async t => {
      await favor.destroy({
        force: true,
        transaction: t
      })
      const art = await Art.getData(type, art_id)
      await art.decrement('fav_nums',{
        by: 1,
        transaction: t
      })
    })
  }
}
// 喜欢的业务表
Favor.init({
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
},{
  sequelize,
  tableName:'favor'
})
module.exports = {
  Favor
}