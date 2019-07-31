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
}
module.exports = {
  Art
}