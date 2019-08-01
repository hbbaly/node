const { sequelize } = require('../../core/db')

const { Sequelize, Model,Op } = require('sequelize')
const { LikeError, DislikeError, notFound} = require('../../core/http-execption')
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
  static async likeIt (art_id, type, uid) {
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    return favor ? true : false
  }
  static async getMyClassicFavor (uid) {
    // 全部的点赞
    const favor = await Favor.findAll({
      where:{
        uid,
        type:{
          [Op.not]:400,
        }
      }
    })
    console.log(favor,'--------')
    if (!favor) throw new notFound()
    // 获取每个对应的详情
    let classicFavorObj = {
      100: [],
      200: [],
      300: []
    }
    for (let item of favor) {
      classicFavorObj[item.type].push(item.art_id)
    }
    return await Art.getList(classicFavorObj)
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