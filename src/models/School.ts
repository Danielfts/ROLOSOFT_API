import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, BelongsToGetAssociationMixin } from "sequelize";
import { sequelize } from "../config/db";
import Address from "./Address";
import { UUID } from "crypto";
import Team from "./Team";

class School extends Model <InferAttributes<School>, InferCreationAttributes<School>> {
  declare id: CreationOptional<UUID>;
  declare name: string;
  declare addressId: UUID;
  declare Address : NonAttribute<Address>;

  declare getAddress: BelongsToGetAssociationMixin<Address>;
  
  //Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
  declare Team: NonAttribute<Team>;
}

School.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressId: {
    type: DataTypes.UUID,
    references: {
      model: Address,
      key: "id",
    },
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
  }
}, {
  sequelize,
  
  tableName: "School",
  modelName: "School",
  timestamps: true,
  paranoid: true
});

// Address association
School.belongsTo(Address, {
  foreignKey: "addressId",
});
Address.hasOne(School, {
  foreignKey: "addressId",
});

export default School;
