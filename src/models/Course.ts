import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

class Course extends Model {}
Course.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "Course",
  modelName: "Course",
  timestamps: false
});

export default Course;
