const commonConfig  = require( './default.config')
const developmentConfig  = require( './development.config')
const productionConfig  = require( './production.config')

function buildConfig (type) {
  let envConfig = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
  return Object.assign(commonConfig, envConfig)
}
module.exports = buildConfig()
