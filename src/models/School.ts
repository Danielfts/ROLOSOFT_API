import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Address from "./Address";

class School extends Model {}
School.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.UUID,
    references: {
      model: Address,
      key: "id",
    },
  },
}, {
  sequelize,
  tableName: "School",
  modelName: "School",
  timestamps: false
});

// Address association
School.hasOne(Address, {
  foreignKey: {
    name: "address"
  }
});

Address.belongsTo(School, {
  foreignKey: {
    name: "address"
  }
});

export default School;
