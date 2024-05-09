import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey, CreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import { sequelize } from "../config/db";
import Team from "./Team";
import Address from "./Address";
import Phase from "./Phase";
import { UUID } from "crypto";
import Tournament from "./Tournament";

class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
  declare id: UUID;
  declare teamAId: ForeignKey<UUID>;
  declare teamBId: ForeignKey<UUID>;
  declare startDate: Date;
  declare endDate: CreationOptional<Date>;
  declare phaseId: ForeignKey<UUID>;
  declare addressId: ForeignKey<UUID>

  declare Phase : NonAttribute<Phase>;
  declare Address: NonAttribute<Address>; 
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
  },
  addressId: {
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

Match.belongsTo(Tournament, {
  foreignKey: {
    name: "tournamentId",
    allowNull: false
  }
})

export default Match;
