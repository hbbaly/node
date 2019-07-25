const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

class Flow extends Model {

}
// flow已art_id及type来区分是movie， music， sentence
Flow.init({
  index: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
},{
  sequelize,
  tableName:'flow'
})
module.exports = {
  Flow
}