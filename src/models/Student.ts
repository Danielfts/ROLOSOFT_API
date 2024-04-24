import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";
import { UUID } from "crypto";

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  declare id: ForeignKey<UUID>;
  declare school: string;
  declare fieldPosition: string;
  declare shirtNumber: number;
  declare team: string;
  declare IMSS: string;

  //Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    school: {
      type: DataTypes.UUID,
    },
    fieldPosition: {
      type: DataTypes.UUID,
    },
    shirtNumber: {
      type: DataTypes.INTEGER,
    },
    team: {
      type: DataTypes.UUID,
    },
    IMSS: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize,
    tableName: "Student",
    modelName: "Student",
    paranoid: true,
    timestamps: true,
  }
);

Student.belongsTo(User, {
  foreignKey: {name: "id", allowNull: false},
  onDelete: "CASCADE",
});

User.hasOne(Student,{
  foreignKey: {name: "id", allowNull: false},
  onDelete: "CASCADE"
});

export default Student;
