const { Op } = require('sequelize')
const {
  flatten
} = require('lodash')
const { Movie, Music, Sentence} = require('./classic')
class Art {
  static async getData (type, id, useScope){
    const finder = {
      where:{
        id: id
      }
    }
    let art = null, scoped = useScope ? 'bh' : null
    switch(type){
      case 100:
        art = await Movie.scope(scoped).findOne(finder)
        break;
      case 200: 
        art = await Music.scope(scoped).findOne(finder)
        break;
      case 300:
        art = await Sentence.scope(scoped).findOne(finder)
        break;
      case 400:
        break;
      default:
        break;
    }
    return art
  }
  static async getList (list) {
    let arts = []
    for (let item in list) {
      const ids = list[item]
      if (!ids.length) continue;
      const key = parseInt(item)
      const artType = await Art.__getListByIds(ids, key, true)
      arts.push(artType)
    }
    return flatten(arts)
  }
  static async __getListByIds (ids, type, useScope){
    let art = [], scoped = useScope ? 'bh' : null
    const finder = {
      where:{
        id: {
          [Op.in]: ids
        }
      }
    }
    switch(type){
      case 100:
        art = await Movie.scope(scoped).findOne(finder)
        break;
      case 200: 
        art = await Music.scope(scoped).findOne(finder)
        break;
      case 300:
        art = await Sentence.scope(scoped).findOne(finder)
        break;
      case 400:
        break;
      default:
        break;
    }
    return art
  }
  static async getDetail (type, id, uid){
    const art = await Art.getData(type, id, true)
    return art
  }
}
module.exports = {
  Art
}