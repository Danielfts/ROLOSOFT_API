import { DataTypes, Model} from "sequelize";
import { sequelize } from "../config/db";

class Participant extends Model {};

Participant.init(
  {
    
  },
  {
    sequelize,
    tableName: "participants",
    timestamps: true,
    paranoid: true,
  }
);