import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey, CreationAttributes, CreationOptional, NonAttribute, BelongsToGetAssociationMixin } from "sequelize";
import { sequelize } from "../config/db";
import Team from "./Team";
import Phase from "./Phase";
import { UUID } from "crypto";


class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
  declare id: CreationOptional<UUID>;
  declare teamAId: ForeignKey<UUID>;
  declare teamBId: ForeignKey<UUID>;
  declare startDate: Date;
  declare endDate: CreationOptional<Date>;
  declare phaseId: ForeignKey<UUID>;

  //MIXINS
  declare TeamA: NonAttribute<Team>;
  declare TeamB: NonAttribute<Team>;

  declare getTeamA: BelongsToGetAssociationMixin<Team>;
  declare getTeamB: BelongsToGetAssociationMixin<Team>;

  declare Phase : NonAttribute<Phase>;
}
Match.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  teamAId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Team,
      key: "id",
    },
  },
  teamBId: {
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
  phaseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Phase,
      key: "id",
    },
  }
}, {
  sequelize,
  tableName: "Match",
  modelName: "Match",
  timestamps: false
});

Match.belongsTo(Phase, {
  foreignKey: {
    name: "phaseId",
    allowNull: false
  }
})

Phase.hasMany(Match, {
  foreignKey: {
    name: "phaseId"
  }
})

Match.belongsTo(Team, {
  foreignKey: {
    name: "teamAId",
    allowNull: false
  }
})

Match.belongsTo(Team, {
  foreignKey: {
    name: "teamBId",
    allowNull: false
  }
})

Team.hasMany(Match, {
  foreignKey: {
    name: "teamAId"
  }
})

Team.hasMany(Match, {
  foreignKey: {
    name: "teamBId"
  }
})

export default Match;
