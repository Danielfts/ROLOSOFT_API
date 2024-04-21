import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Team from "./Team";
import Address from "./Address";
import Phase from "./Phase";

class Match extends Model {}
Match.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  teamA: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Team,
      key: "id",
    },
  },
  teamB: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Team,
      key: "id",
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  phase: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Phase,
      key: "id",
    },
  },
  address: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Address,
      key: "id",
    },
  }
}, {
  sequelize,
  tableName: "Match",
  modelName: "Match",
  timestamps: false
});

export default Match;
