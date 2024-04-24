import { UUID } from "crypto";
import StudentDTO from "../dtos/studentDTO";
import Student from "../models/Student";
import { Transaction } from "sequelize";

class StudentService {
  public static async createStudent(
    userId: UUID,
    student: StudentDTO,
    t?: Transaction
  ) {
    const createdStudent = await Student.create(
      {
        id: userId,
        school: student.school,
        fieldPosition: student.fieldPosition,
        shirtNumber: student.shirtNumber,
        team: student.team,
        IMSS: student.IMSS,
      },
      { transaction: t }
    );
    return createdStudent;
  }
}

export default StudentService;
