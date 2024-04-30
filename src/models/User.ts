import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional, NonAttribute, HasOneGetAssociationMixin, Association } from "sequelize";
import { sequelize } from "../config/db";
import Gender from "./Gender";
import Address from "./Address";
import { UUID } from "crypto";
import Student from "./Student";
import Admin from "./Admin";

class User extends Model < InferAttributes<User, {}>, InferCreationAttributes<User, {}>> {

  declare id:CreationOptional <UUID>;
  declare CURP: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare birthDate: Date;
  declare Gender: NonAttribute<Gender>;
  declare Address: NonAttribute<Address>;
  declare genderId: ForeignKey<UUID>;
  declare phone: string;
  declare photo: string | null;
  declare addressId: ForeignKey<UUID> | null;
  declare role: string;

  //MIXINS
  declare getGender: HasOneGetAssociationMixin<Gender>;
  declare getStudent: HasOneGetAssociationMixin<Student>;
  declare getAdmin: HasOneGetAssociationMixin<Admin>;
  declare getAddress: HasOneGetAssociationMixin<Address>;

  //Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;

  //Associations
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  addressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Address,
      key: "id",
    },
  },
  genderId: {
    type: DataTypes.UUID,
    references: {
      model: Gender,
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
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM("admin", "student"),
    allowNull: false,
  },
  CURP: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  sequelize,
  tableName: "User",
  modelName: "User",
  paranoid: true,
  timestamps: true
});

// Gender association

User.belongsTo(Gender, {
  foreignKey: {
    name: "genderId",
    allowNull: false,
  }
});

User.belongsTo(Address, {
  foreignKey: {
    name: "addressId",
    allowNull: false
  }
});

Address.hasOne(User, {
  foreignKey: "addressId"
})


export default User;
