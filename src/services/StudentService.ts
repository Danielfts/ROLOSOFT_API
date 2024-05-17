import { UUID } from "crypto";
import StudentDTO from "../dtos/studentDTO";
import Student from "../models/Student";
import { Transaction } from "sequelize";
import TeamService from "./TeamService";

class StudentService {
  public static mapStudent(student: Student): StudentDTO {
    const dto : StudentDTO = {
      fieldPosition: student.fieldPosition,
      shirtNumber: student.shirtNumber,
      IMSS: student.IMSS,
    }
    return dto;
  }

  public static async createStudent(
    userId: UUID,
    student: StudentDTO,
    t?: Transaction
  ) {
    const createdStudent = await Student.create(
      {
        id: userId,
        fieldPosition: student.fieldPosition,
        shirtNumber: student.shirtNumber,
        IMSS: student.IMSS,
      },
      { transaction: t }
    );
    return createdStudent;
  }
}

export default StudentService;
