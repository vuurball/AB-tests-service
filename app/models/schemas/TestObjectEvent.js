'use strict'

exports.getSchema = (dbcon, DataTypes) => {
  return {
    schema: {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      test_obj_id: { type: DataTypes.INTEGER, allowNull: false },
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      event_data: { type: DataTypes.TEXT, allowNull: false },
    },
    options: {
      tableName: 'test_objects_events',
      timestamps: false,
      freezeTableName: true,
      sequelize: dbcon,
    }
  }
}