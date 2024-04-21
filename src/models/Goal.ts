import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Student from "./Student";
import Match from "./Match";

class Goal extends Model {}
Goal.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  match: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Match,
      key: "id",
    },
  },
  student: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Student,
      key: "id",
    },
  },
  minute: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "Goal",
  modelName: "Goal"
});

Match.hasMany(Goal, {
  foreignKey: {
    name: "match",
    allowNull: false
  }
});
Goal.belongsTo(Match, {
  foreignKey: {
    name: "match",
    allowNull: false
  }
});

Student.hasMany(Goal, {
  foreignKey: {
    name: "student",
    allowNull: false
  }
});
Goal.belongsTo(Student, {
  foreignKey: {
    name: "student",
    allowNull: false
  }
});

export default Goal;
