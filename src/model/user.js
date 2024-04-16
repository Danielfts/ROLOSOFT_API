// Create a user model for sequelize and mysql

import { DataTypes } from "sequelize";
import { sequelize_write } from "../../config/db.js";

export const User = sequelize_write.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    password_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },

  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);
