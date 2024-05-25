import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute, CreationOptional } from "sequelize";
import { sequelize } from "../config/db";
import Student from "./Student";
import Match from "./Match";
import { UUID } from "crypto";
import Team from "./Team";

class Goal extends Model<InferAttributes<Goal>, InferCreationAttributes<Goal>> {
  declare id : CreationOptional<UUID>
  declare matchId: ForeignKey<UUID>
  declare studentId: ForeignKey<UUID>
  declare teamId: ForeignKey<UUID>
  declare minute: number

  declare Match: NonAttribute<Match>
  declare Student: NonAttribute<Student>
  declare ForTeam: NonAttribute<Team>
}
Goal.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  matchId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Match,
      key: "id",
    },
  },
  studentId: {
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
    name: "matchId",
    allowNull: false
  }
});
Goal.belongsTo(Match, {
  foreignKey: {
    name: "matchId",
    allowNull: false
  }
});

Student.hasMany(Goal, {
  foreignKey: {
    name: "studentId",
    allowNull: false
  }
});
Goal.belongsTo(Student, {
  foreignKey: {
    name: "studentId",
    allowNull: false
  }
});

Team.hasMany(Goal, {
  foreignKey: {
    name: "teamId",
    allowNull: false
  }
})

Goal.belongsTo(Team, {
  foreignKey: {
    name: "teamId",
    allowNull: false
  }
})

export default Goal;
