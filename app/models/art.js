const { Op } = require('sequelize')
const {
  flatten
} = require('lodash')
const { Movie, Music, Sentence} = require('./classic')
class Art {
  constructor (type, id){
    this.type = type
    this.id = id
  }
  async getData (useScope){
    const finder = {
      where:{
        id: this.id
      }
    }
    let scoped = useScope ? 'bh' : null
    return await Art.__selectModel(this.type, finder, scoped)
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
    let scoped = useScope ? 'bh' : null
    const finder = {
      where:{
        id: {
          [Op.in]: ids
        }
      }
    }
    return await Art.__selectModel(type, finder, scoped)
  }
  async getDetail (uid){
    const art = await new Art(this.type, this.id).getData(true)
    return art
  }
  static async __selectModel (type, finder, scoped){
    let art = []
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
}
module.exports = {
  Art
}