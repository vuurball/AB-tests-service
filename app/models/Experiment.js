const { dbcon, Sequelize } = require('../../database/db')
const { DataTypes, Model } = Sequelize
const { getSchema } = require('./schemas/Experiment')


class Experiment extends Model {

  static async findByName(name) {
    return await this.findOne({ where: {name }})
  }

  static async findAllActive() {
    const now = Math.floor(new Date() / 1000)
    return await this.findAll({
      attributes: ['name', 'default_variant_name', 'end_at'],
      where: {
        is_active: 1,
        start_at: {[Sequelize.Op.lt]: now },
        end_at: {[Sequelize.Op.gt]: now }
      }
    })
  }

}



const { schema, options } = getSchema(dbcon, DataTypes)
Experiment.init(schema, options)

module.exports = Experiment