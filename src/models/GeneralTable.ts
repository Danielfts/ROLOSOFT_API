import { sequelize } from "../config/db";
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { UUID } from "crypto";
import Team from "./Team";

class GeneralTable extends Model<
  InferAttributes<GeneralTable>,
  InferCreationAttributes<GeneralTable>
> {
  declare id: CreationOptional<UUID>;
  declare teamId: ForeignKey<UUID>;
  declare position: number;
  declare defeats: number;
  declare draws: number;
  declare victories: number;
  declare points: number;
  declare goalsFor: number;
  declare goalsAgainst: number;
  declare goalDifference: number;
  declare gamesPlayed: number;

  //Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
  declare Team: NonAttribute<Team>;
}

GeneralTable.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: Team,
        key: "id",
      },
      unique: true,
    },
    defeats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    draws: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    victories: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    goalsFor: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    goalsAgainst: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    goalDifference: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gamesPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "GeneralTable",
    modelName: "GeneralTable",
    timestamps: true,
  }
);

GeneralTable.belongsTo(Team, {
  foreignKey: {
    name: "teamId",
    allowNull: false,
  },
});

Team.hasOne(GeneralTable, {
  as: "Statistics",
  foreignKey: {
    name: "teamId",
    allowNull: false,
  },
});

export default GeneralTable;
