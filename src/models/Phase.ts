import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../config/db";
import { UUID } from "crypto";

class Phase extends Model <InferAttributes<Phase>, InferCreationAttributes<Phase>> {
  declare id: CreationOptional<UUID>;
  declare name: string;
  declare startDate: Date;
  declare endDate: Date
}
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
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "Phase",
  modelName: "Phase",
  timestamps: false
});

export default Phase;
