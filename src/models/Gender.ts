import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../config/db";
import { UUID } from "crypto";

class Gender extends Model<InferAttributes<Gender>, InferCreationAttributes<Gender>> {
  declare id: CreationOptional<UUID>;
  declare name: string;
}
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
