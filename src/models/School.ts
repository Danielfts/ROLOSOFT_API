import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, BelongsToGetAssociationMixin, HasManyAddAssociationsMixin } from "sequelize";
import { sequelize } from "../config/db";
import Address from "./Address";
import { UUID } from "crypto";
import Team from "./Team";
import Student from "./Student";

class School extends Model <InferAttributes<School>, InferCreationAttributes<School>> {
  declare id: CreationOptional<UUID>;
  declare name: string;
  declare clave: string;
  declare addressId: UUID;
  declare Address : NonAttribute<Address>;
  declare shieldFileName: CreationOptional<string>;

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
  clave: {
    type: DataTypes.STRING,
    allowNull: false,
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
  },
  shieldFileName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Escudo_de_Independiente_Santa_Fe.png/150px-Escudo_de_Independiente_Santa_Fe.png",
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
