const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

const classicFileds  = {
  image: {
      type:Sequelize.STRING,
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
      type:Sequelize.INTEGER,
      defaultValue:0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model {

}
Movie.init(classicFileds,{
  sequelize,
  tableName: 'movie'
})

class Music extends Model {

}
const musicFileds = Object.assign({url: Sequelize.STRING}, classicFileds)
Music.init(musicFileds,{
  sequelize,
  tableName: 'music'
})

class Sentence extends Model {
}

Sentence.init(classicFileds, {
    sequelize,
    tableName: 'sentence'
})

module.exports = {
  Movie,
  Sentence,
  Music
}