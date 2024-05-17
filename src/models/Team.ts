import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  BelongsToGetAssociationMixin,
  HasManyAddAssociationsMixin,
} from "sequelize";
import { sequelize } from "../config/db";
import School from "./School";
import Phase from "./Phase";
import { UUID } from "crypto";
import Tournament from "./Tournament";
import { allow } from "joi";
import Student from "./Student";

class Team extends Model<InferAttributes<Team>, InferCreationAttributes<Team>> {
  declare id: CreationOptional<UUID>;
  declare sponsor: string;
  declare schoolId: ForeignKey<UUID>;
  declare tournamentId: ForeignKey<UUID>;
  declare points: CreationOptional<number>;
  declare phaseId: CreationOptional<ForeignKey<UUID>>;
  // TODO declare phase stuff

  declare Phase: NonAttribute<Phase>;
  declare School: NonAttribute<School>;
  declare Tournament: NonAttribute<Tournament>;

  declare getSchool: BelongsToGetAssociationMixin<School>;
  declare getTournament: BelongsToGetAssociationMixin<Tournament>;

  declare addStudents: HasManyAddAssociationsMixin<Student, UUID>;
}
Team.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: "compositeUnique",
      references: {
        model: School,
        key: "id",
      },
    },
    tournamentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: "compositeUnique",
      references: {
        model: Tournament,
        key: "id",
      },
    },
    sponsor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phaseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Phase,
        key: "id",
      },
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "Team",
    modelName: "Team",
  }
);

Team.belongsTo(School, {
  foreignKey: {
    name: "schoolId",
    allowNull: false,
  },
});

School.hasOne(Team, {
  foreignKey: "schoolId",
});

Team.belongsTo(Tournament, {
  foreignKey: {
    name: "tournamentId",
    allowNull: false,
  },
});

Tournament.hasOne(Team, {
  foreignKey: "tournamentId",
});

Team.belongsTo(Phase, {
  foreignKey: { name: "phaseId", allowNull: true },
});

Phase.hasMany(Team, { foreignKey: "phaseId" });

export default Team;
