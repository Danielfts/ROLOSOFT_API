import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize";
import { sequelize } from "../config/db";
import Gender from "./Gender";
import Address from "./Address";
import { UUID } from "crypto";

class User extends Model < InferAttributes<User>, InferCreationAttributes<User>> {
  declare id:CreationOptional <UUID>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare birthDate: Date;
  declare gender: ForeignKey<UUID>;
  declare phone: string | null;
  declare photo: string | null;
  declare address: ForeignKey<UUID> | null;

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
  address: {
    type: DataTypes.UUID,
    references: {
      model: Address,
      key: "id",
    },
  },
  gender: {
    type: DataTypes.UUID,
    references: {
      model: Gender,
      key: "id",
    },
  },
}, {
  sequelize,
  tableName: "User",
  modelName: "User",
  paranoid: true,
});

// Gender association
Gender.hasMany(User, {
  foreignKey: {
    name: "gender",
    allowNull: false
  }
});

User.belongsTo(Gender, {
  foreignKey: {
    name: "gender",
    allowNull: false
  }
});

// Address association
User.hasOne(Address, {
  foreignKey: {
    name: "address"
  }
});

Address.belongsTo(User, {
  foreignKey: {
    name: "address"
  }
});

export default User;
