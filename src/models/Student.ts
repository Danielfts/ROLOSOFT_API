import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";
import { UUID } from "crypto";
import Team from "./Team";
import Goal from "./Goal";
import GreenCard from "./GreenCard";

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  declare id: ForeignKey<UUID>;
  declare fieldPosition: string;
  declare shirtNumber: number;
  declare IMSS: string;
  declare photoFileName: CreationOptional<string>;

  declare teamId: ForeignKey<UUID | null>;

  declare Team: NonAttribute<Team>;
  declare User: NonAttribute<User>;
  declare Goals: NonAttribute<Goal[]>;
  declare GreenCards: NonAttribute<GreenCard[]>


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
    fieldPosition: {
      type: DataTypes.STRING,
    },
    shirtNumber: {
      type: DataTypes.INTEGER,
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: Team,
        key: "id",
      },
      allowNull: true,
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
    photoFileName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "default-profile.png",
    }
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
  foreignKey: { name: "id", allowNull: false },
  onDelete: "CASCADE",
});

User.hasOne(Student, {
  foreignKey: { name: "id", allowNull: false },
  onDelete: "CASCADE",
});

Student.belongsTo(Team, {
  foreignKey: {
    name: "teamId",
    allowNull: true,
  },
});

Team.hasMany(Student, {
  foreignKey: "teamId",
});

export default Student;
