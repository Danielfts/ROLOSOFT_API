import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {}

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
    CURP: {
      type: DataTypes.STRING,
    },
    IMSS: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "Student",
    modelName: "Student",
  }
);

Student.belongsTo(User, {
  foreignKey: "id",
});

User.hasOne(Student)

export default Student;
