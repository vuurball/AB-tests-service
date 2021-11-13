'use strict'

exports.getSchema = (dbcon, DataTypes) => {
  return {
    schema: {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      default_variant_name: { type: DataTypes.STRING, allowNull: false },
      is_active: { type: DataTypes.TINYINT, allowNull: false, defaultValue: '0' },
      start_at: { type: DataTypes.DATE },
      end_at: { type: DataTypes.DATE }
    },
    options: {
      tableName: 'experiments',
      timestamps: false,
      freezeTableName: true,
      sequelize: dbcon,
    }
  }
}