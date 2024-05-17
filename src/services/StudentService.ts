import { UUID } from "crypto";
import StudentDTO from "../dtos/studentDTO";
import Student from "../models/Student";
import { Op, Transaction } from "sequelize";
import TeamService from "./TeamService";
import Team from "../models/Team";
import User from "../models/User";

class StudentService {
  public static mapStudent(student: Student): StudentDTO {
    const dto: StudentDTO = {
      fieldPosition: student.fieldPosition,
      shirtNumber: student.shirtNumber,
      IMSS: student.IMSS,
    };
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

  public static async findStudentsNotOnTournament(
    tournamentId: UUID | string
  ): Promise<{ name: string; id: UUID }[]> {
    const result: Student[] = await Student.findAll({
      where: {
        [Op.or] : {
          "$Team.tournamentId$": { [Op.ne]: tournamentId },
          teamId : null
        },
      },
      include: [{ model: Team }, { model: User }],
      attributes: { include: ["User.firstName", "id"] },
    });
    const data: { name: string; id: UUID }[] = result.map((i) => {
      return { name: i.User.firstName, id: i.id };
    });
    return data;
  }
}

export default StudentService;
