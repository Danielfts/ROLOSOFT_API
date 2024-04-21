import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

class Coach extends Model {}
Coach.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: User,
      key: "id",
    },
  }
}, {
  sequelize,
  tableName: "Coach",
  modelName: "Coach"
});

// User association
User.hasOne(Coach, {
  foreignKey: {
    name: "id",
    allowNull: false,
  }
});

Coach.belongsTo(User, {
  foreignKey: {
    name: "id",
    allowNull: false,
  }
});

export default Coach;
