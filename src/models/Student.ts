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

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  declare id: ForeignKey<UUID>;
  declare fieldPosition: string;
  declare shirtNumber: number;
  declare IMSS: string;
  declare greenCards: CreationOptional<number>;
  declare photoUrl: CreationOptional<string>;

  declare teamId: ForeignKey<UUID | null>;

  declare Team: NonAttribute<Team>;
  declare User: NonAttribute<User>;
  declare Goals: NonAttribute<Goal[]>;


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
      type: DataTypes.UUID,
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
    greenCards: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://www.mykhel.com/thumb/190x90x190/football/players/4/19054.1527496212.jpg",
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
