const { Movie, Music, Sentence} = require('./classic')
class Art {
  static async getData (type, id){
    const finder = {
      where:{
        id: id
      }
    }
    let art = null
    switch(type){
      case 100:
        art = await Movie.findOne(finder)
        break;
      case 200: 
        art = await Music.findOne(finder)
        break;
      case 300:
        art = await Sentence.findOne(finder)
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