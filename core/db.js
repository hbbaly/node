const {Sequelize, Model} = require('sequelize')

const { dbName, user, password, port, host} = require('../config/index').DATABASE
const { clone, unset, isArray } = require('lodash')
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
    underscored: true ,  // 吧所有驼峰转化为下划线
    scopes:{
      'bh':{
        attributes: {
          exclude: ['updated_at', 'deleted_at','created_at']
        },
      }
    }
  }
})
// force 千万不要设置为true， 他会先删除表，在创建表，原来表里面的内容就会丢失
sequelize.sync({force: false})
// 整体去除返回数据中不要的字段
Model.prototype.toJSON = function(){
  // let data = this.dataValues
  let data = clone(this.dataValues)
  // unset(data, 'updated_at')
  // unset(data, 'created_at')
  // unset(data, 'deleted_at')

  if(isArray(this.exclude)){
      this.exclude.forEach(
          (value)=>{
              unset(data,value)
          }
      )
  }
  return data
}


module.exports = {
  sequelize
}