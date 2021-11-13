const { dbcon, Sequelize } = require('../db')
const { DataTypes, Model } = Sequelize
const { getSchema } = require('./schemas/TestObjectEvent')


class Experiment extends Model {

  static async findByName(name) {
    return await this.findOne({ where: {name }})
  }

}


//  Initialize table structure 
console.log('Initialize table structure Experiment')
const { schema, options } = getSchema(dbcon, DataTypes)
Experiment.init(schema, options)


module.exports = Experiment