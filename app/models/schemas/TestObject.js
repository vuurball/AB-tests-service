'use strict'

exports.getSchema = (dbcon, DataTypes) => {
  return {
    schema: {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      experiment_id: { type: DataTypes.INTEGER, allowNull: false },
      tested_entity_type: { type: DataTypes.STRING, allowNull: false },
      tested_entity_id: { type: DataTypes.STRING, allowNull: false },
      variant_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    options: {
      tableName: 'test_objects',
      timestamps: false,
      freezeTableName: true,
      sequelize: dbcon,
    }
  }
}