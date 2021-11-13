const Sequelize = require('sequelize')

console.log(`connecting to db ${process.env.DB_NAME}`)

const dbcon = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)



dbcon.authenticate().then(function() {
  console.log(' Database connection successful ')
}).catch(function(err) { 
  console.error(err)
  throw err
})   

module.exports = {
  Sequelize,
  dbcon
}