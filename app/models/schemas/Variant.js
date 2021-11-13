'use strict'

exports.getSchema = (dbcon, DataTypes) => {
  return {
    schema: {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      experiment_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      allocation: { type: DataTypes.INTEGER, allowNull: false },
    },
    options: {
      tableName: 'variants',
      timestamps: false,
      freezeTableName: true,
      sequelize: dbcon,
    }
  }
}


