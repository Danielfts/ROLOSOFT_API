import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

class FieldPosition extends Model {}
FieldPosition.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "FieldPosition",
  modelName: "FieldPosition",
  timestamps: false
});

export default FieldPosition;
