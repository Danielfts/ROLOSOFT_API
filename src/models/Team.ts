import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import School from "./School";
import Phase from "./Phase";

class Team extends Model {}
Team.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  school: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: School,
      key: "id",
    },
  },
  sponsor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phase: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Phase,
      key: "id",
    },
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: "Team",
  modelName: "Team"
});

Team.hasOne(School, {
  foreignKey: {
    name: "school",
    allowNull: false
  }
});

School.belongsTo(Team, {
  foreignKey: {
    name: "school",
    allowNull: false
  }
});

export default Team;
