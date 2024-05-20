import { UUID } from "crypto";
import StudentDTO from "../dtos/studentDTO";
import Student from "../models/Student";
import { Op, Transaction } from "sequelize";
import TeamService from "./TeamService";
import Team from "../models/Team";
import User from "../models/User";
import UserDTO from "../dtos/userDTO";
import Gender from "../models/Gender";

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

  public static async findStudentsByTournament(
    tournamentId: UUID | string
  ):Promise <UserDTO[]> {
    const result: Student[] = await Student.findAll({
      where: {
        [Op.and] : {
          teamId : {[Op.ne] : null},
          "$Team.tournamentId$": tournamentId,
        }
      },
      include: [Team, {model: User, include: [Gender]}]
    })
    const users : UserDTO[] = await result.map((i) => {
      const dto: UserDTO = {
        CURP: i.User.CURP,
        firstName: i.User.firstName,
        lastName: i.User.lastName,
        email: i.User.lastName,
        birthDate: i.User.birthDate,
        gender: i.User.Gender.name,
        role: i.User.role,
        phone: i.User.role,
        address: i.User.Address,
        student: this.mapStudent(i),
      }
      return dto;
    })
    return users;
  }

  public static async findStudentsNotOnTournament(
    tournamentId: UUID | string
  ): Promise<any[]> {
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
    const data: any[] = result.map((i) => {
      return { firstName: i.User.firstName, lastName: i.User.lastName, curp: i.User.CURP, email: i.User.email,id: i.id };
    });
    return data;
  }
}

export default StudentService;
