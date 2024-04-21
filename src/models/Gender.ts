import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

class Gender extends Model {}
Gender.init({
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
  tableName: "Gender",
  modelName: "Gender",
  timestamps: false
});

export default Gender;
