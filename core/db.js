const Sequelize = require('sequelize')

const { dbName, user, password, port, host} = require('../config/index').DATABASE

const sequelize = new Sequelize(dbName, user, password,{
  dialect:'mysql',
  host,
  port,
  logging:true,
  define: {
    // 显示 create_time, update_time, 
    timestamps: true,
    // delete_time
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true   // 吧所有驼峰转化为下划线
  }
})
// force 千万不要设置为true， 他会先删除表，在创建表，原来表里面的内容就会丢失
sequelize.sync({force: false})

module.exports = {
  sequelize
}