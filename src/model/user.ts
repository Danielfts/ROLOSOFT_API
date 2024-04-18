import { DataTypes, Model} from "sequelize";
import { sequelize } from "../config/db";
import { UserEntity } from "../entities/userEntity";

export const User = sequelize.define (
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);
