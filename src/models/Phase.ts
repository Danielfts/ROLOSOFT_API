import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

class Phase extends Model {}
Phase.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "Phase",
  modelName: "Phase",
  timestamps: false
});

export default Phase;
