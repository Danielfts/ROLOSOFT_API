import { DataTypes, Model, ModelCtor } from "sequelize";
import { sequelize } from "../config/db";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
