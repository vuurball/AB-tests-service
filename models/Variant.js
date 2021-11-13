const { dbcon, Sequelize } = require('../db')
const { DataTypes, Model } = Sequelize

class Variant extends Model {


  static async findById(id) {
    return await this.findOne({ where: { id }})
  }

  /*
   * @throws exception
   */
  static async getVariantToAssign(experimentId) {
    let variantToUse
    const variants = await this.findAll({ where: { experiment_id: experimentId }})
    const randNum = this.getRandomNumber(1, 100)
    let bottom = 0
    for (let variant of variants) {
      if (bottom < randNum && randNum <= (variant.allocation + bottom)) {
        variantToUse = variant
        break
      } 
      bottom += variant.allocation
    }
    if (variantToUse == null) {
      throw `failed to getVariantToAssign for experiment: ${experimentId}, picked number ${randNum}` 
    }
    return variantToUse
  }


  static getRandomNumber(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
}


//  Initialize table structure 
console.log('Initialize table structure Variant')
Variant.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    experiment_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    allocation: { type: DataTypes.INTEGER, allowNull: false },
  }, 
  {
    tableName: 'variants',
    timestamps: false,
    freezeTableName: true,
    sequelize: dbcon,
  }
)

module.exports = Variant