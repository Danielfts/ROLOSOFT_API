import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Gender from "./Gender";

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.UUID,
    references: {
      model: Gender,
      key: "id",
    },
  },
}, {
  sequelize,
  tableName: "User",
  modelName: "User"
});

Gender.hasMany(User, {
  foreignKey: {
    name: "gender",
    allowNull: false
  }
});

User.belongsTo(Gender, {
  foreignKey: {
    name: "gender",
    allowNull: false
  }
});

export default User;
