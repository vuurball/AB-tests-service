const { dbcon, Sequelize } = require('../../database/db')
const { DataTypes, Model } = Sequelize
const { getSchema } = require('./schemas/TestObject')


class TestObject extends Model {


  static async findExistingTestObject(experiment_id, tested_entity_type, tested_entity_id) {
    return await this.findOne({ 
      where: { 
        experiment_id, 
        tested_entity_type, 
        tested_entity_id 
      }
    })
  }


  static async createNewTestObject(experiment_id, tested_entity_type, tested_entity_id, variant_id) {
    return await this.create({
      experiment_id,
      tested_entity_type,
      tested_entity_id,
      variant_id
    })
  }

}



//  Initialize table structure 
console.log('Initialize table structure TestObject')
const { schema, options } = getSchema(dbcon, DataTypes)
TestObject.init(schema, options)

module.exports = TestObject