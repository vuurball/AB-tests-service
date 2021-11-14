const { dbcon, Sequelize } = require('../db')
const { DataTypes, Model } = Sequelize
const { getSchema } = require('./schemas/Experiment')


class Experiment extends Model {

  static async findByName(name) {
    return await this.findOne({ where: {name }})
  }

  static async findAllActive() {
    const now = Math.floor(new Date() / 1000)
    return await this.findAll({
      attributes: ['name', 'default_variant_name'],
      where: {
        is_active: 1,
        start_at: {[Sequelize.Op.lt]: now },
        end_at: {[Sequelize.Op.gt]: now }
      }})
  }

}


//  Initialize table structure 
console.log('Initialize table structure Experiment')
const { schema, options } = getSchema(dbcon, DataTypes)
Experiment.init(schema, options)


module.exports = Experiment