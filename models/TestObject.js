const { dbcon, Sequelize } = require('../db')
const { DataTypes, Model } = Sequelize

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
TestObject.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    experiment_id: { type: DataTypes.INTEGER, allowNull: false },
    tested_entity_type: { type: DataTypes.STRING, allowNull: false },
    tested_entity_id: { type: DataTypes.STRING, allowNull: false },
    variant_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    tableName: 'test_objects',
    timestamps: false,
    freezeTableName: true,
    sequelize: dbcon,
  }
)


module.exports = TestObject