import { UUID } from "crypto";
import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../config/db";
import Address from "./Address";

class Tournament extends Model<
  InferAttributes<Tournament>,
  InferCreationAttributes<Tournament>
> {
  declare id: CreationOptional<UUID>;
  declare name: string;
  declare startDate: Date;
  declare endDate: Date;
  declare Address: NonAttribute<Address>;
  declare addressId: ForeignKey<UUID>;

  declare getAddress: BelongsToGetAssociationMixin<Address>;
}

Tournament.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.UUID,
      references: {
        model: "Address",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "Tournaments",
    modelName: "Tournament",
    timestamps: true,
    paranoid: true,
  }
);

Tournament.belongsTo(Address, {
  foreignKey: "addressId",
});

Address.hasOne(Tournament, {
  foreignKey: "addressId",
});

export default Tournament;
