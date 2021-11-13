const { dbcon, Sequelize } = require('../db')
const { DataTypes, Model } = Sequelize

class Experiment extends Model {

  static async findByName(name) {
    return await this.findOne({ where: {name }})
  }

}


//  Initialize table structure 
console.log('Initialize table structure Experiment')
Experiment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    default_variant_name: { type: DataTypes.STRING, allowNull: false },
    is_active: { type: DataTypes.TINYINT, allowNull: false, defaultValue: '0' },
    start_at: { type: DataTypes.DATE },
    end_at: { type: DataTypes.DATE }
  }, {
    tableName: 'experiments',
    timestamps: false,
    freezeTableName: true,
    sequelize: dbcon,
  }
)


module.exports = Experiment