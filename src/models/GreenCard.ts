import { UUID } from "crypto";
import {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  DataTypes,
} from "sequelize";
import Student from "./Student";
import { sequelize } from "../config/db";

class GreenCard extends Model<
  InferAttributes<GreenCard>,
  InferCreationAttributes<GreenCard>
> {
  declare id: CreationOptional<UUID>;
  declare studentId: ForeignKey<UUID>;
  declare Student: NonAttribute<Student>;
  declare reason: string;

  //Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
}

GreenCard.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      references: {
        model: Student,
        key: "id",
      },
      allowNull: false,
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
    tableName: "GreenCard",
    modelName: "GreenCard",
    paranoid: true,
    timestamps: true,
  }
);

Student.hasMany(GreenCard, {
  foreignKey: {
    name: "studentId"
  }
})

GreenCard.belongsTo(Student, {
  foreignKey: {
    name: "studentId"
  }
})

export default GreenCard;