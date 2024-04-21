import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Student from "./Student";
import Parent from "./Parent";

class Student_Parent extends Model {}
Student_Parent.init({
  student: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "id",
    },
  },
  parent: {
    type: DataTypes.INTEGER,
    references: {
      model: Parent,
      key: "id",
    },
  },
}, {
  sequelize,
  tableName: "Student_Parent",
  modelName: "Student_Parent",
  timestamps: false
});

Student.belongsToMany(Parent, { through: Student_Parent });
Parent.belongsToMany(Student, { through: Student_Parent });
