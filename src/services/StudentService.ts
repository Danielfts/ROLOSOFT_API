import { UUID } from "crypto";
import StudentDTO from "../dtos/studentDTO";
import Student from "../models/Student";
import { Op, Transaction, where } from "sequelize";
import TeamService from "./TeamService";
import Team from "../models/Team";
import User from "../models/User";
import UserDTO from "../dtos/userDTO";
import Gender from "../models/Gender";
import ClientError from "../errors/ClientError";
import { StatusCodes } from "http-status-codes";
import TournamentService from "./TournamentService";
import School from "../models/School";
import Address from "../models/Address";
import GreenCard from "../models/GreenCard";
import { string } from "joi";
import Tournament from "../models/Tournament";
import Goal from "../models/Goal";

class StudentService {
  public static async findStudentsByTournamentAndSchool(
    tournamentId: UUID,
    schoolId: UUID
  ): Promise<UserDTO[]> {
    const studentUsers: User[] = await User.findAll({
      include: [
        {
          model: Gender,
        },
        {
          model: Address,
        },
        {
          model: Student,
          right: true,
          include: [
            {
              model: GreenCard,
              as: "GreenCards",
            },
            {
              model: Team,
              right: true,
              include: [
                {
                  model: School,
                },
              ],
              where: {
                tournamentId: tournamentId,
                schoolId: schoolId,
              },
            },
          ],
        },
      ],
    });
    const dtos: UserDTO[] = studentUsers.map((i): UserDTO => {
      const dto: UserDTO = {
        id: i.id,
        CURP: i.CURP,
        firstName: i.firstName,
        lastName: i.lastName,
        email: i.email,
        birthDate: i.birthDate,
        gender: i.Gender.name,
        role: i.role,
        phone: i.phone,
        address: i.Address,
        student: this.mapStudent(i.Student),
      };
      dto.student!.team = {
        school: {
          id: i.Student.Team.schoolId,
          name: i.Student.Team.School.name,
          number: i.Student.Team.School.number,
        },
      };
      return dto;
    });
    return dtos;
  }
  public static async registerStudentOnTeam(
    studentId: UUID,
    tournamentId: UUID,
    schoolId: UUID
  ) {
    const team: Team | null = await Team.findOne({
      where: {
        tournamentId: tournamentId,
        schoolId: schoolId,
      },
    });

    if (team === null) {
      throw new ClientError(
        StatusCodes.BAD_REQUEST,
        `There is no school with id: ${schoolId} registered on tournament with id: ${tournamentId}`
      );
    }
    const teamId = team.id;

    Student.update(
      { teamId: teamId },
      {
        where: {
          id: studentId,
        },
      }
    );
  }
  public static mapStudent(student: Student): StudentDTO {
    const dto: StudentDTO = {
      fieldPosition: student.fieldPosition,
      shirtNumber: student.shirtNumber,
      IMSS: student.IMSS,
      team: student.Team,
      photoFileName: student.photoFileName,
      greenCards: student.GreenCards || [],
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
  ): Promise<UserDTO[]> {
    const tournament = await TournamentService.getTournamentById(tournamentId);
    if (tournament === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Tournament with id ${tournamentId} not found`
      );
    }

    const result: Student[] = await Student.findAll({
      where: {
        [Op.and]: {
          teamId: { [Op.ne]: null },
          "$Team.tournamentId$": tournamentId,
        },
      },
      include: [
        { model: Team, include: [School] },
        { model: User, include: [Gender] },
        { model: GreenCard, as: "GreenCards" },
      ],
    });
    const users: UserDTO[] = result.map((i) => {
      const dto: UserDTO = {
        id: i.id,
        CURP: i.User.CURP,
        firstName: i.User.firstName,
        lastName: i.User.lastName,
        email: i.User.email,
        birthDate: i.User.birthDate,
        gender: i.User.Gender.name,
        role: i.User.role,
        phone: i.User.phone,
        address: i.User.Address,
        student: this.mapStudent(i),
      };
      dto.student!.team = {
        school: {
          id: i.Team.schoolId,
          name: i.Team.School.name,
          number: i.Team.School.number,
        },
      };
      return dto;
    });
    return users;
  }

  public static async findStudentsNotOnTournament(
    tournamentId: UUID | string
  ): Promise<any[]> {
    const tournament: Tournament | null = await Tournament.findByPk(
      tournamentId
    );
    if (tournament === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Tournament with id ${tournamentId} not found`
      );
    }
    const result: Student[] = await Student.findAll({
      where: {
        [Op.or]: {
          "$Team.tournamentId$": { [Op.ne]: tournamentId },
          teamId: null,
        },
      },
      include: [{ model: Team }, { model: User }],
      attributes: { include: ["User.firstName", "id"] },
    });
    const data: any[] = result.map((i) => {
      return {
        firstName: i.User.firstName,
        lastName: i.User.lastName,
        CURP: i.User.CURP,
        email: i.User.email,
        id: i.id,
      };
    });
    return data;
  }

  public static async addGreenCardToStudent(
    studentId: UUID,
    reason: string
  ): Promise<any> {
    const student: Student | null = await Student.findOne({
      where: { id: studentId },
    });
    if (student === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Student with id ${studentId} not found`
      );
    }
    const created = await GreenCard.create({
      studentId: studentId,
      reason: reason,
    });
    return created;
  }

  public static async setPhotoFileName(
    studentId: any,
    file: Express.Multer.File | undefined
  ) {
    const student: Student | null = await Student.findOne({
      where: { id: studentId },
    });
    if (student === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Student with id ${studentId} not found`
      );
    }
    if (file === undefined) {
      throw new ClientError(StatusCodes.BAD_REQUEST, `File is required`);
    }
    const updated = await Student.update(
      {
        photoFileName: file.filename,
      },
      {
        where: {
          id: studentId,
        },
      }
    );
    return file.filename;
  }

  public static async getStudentDetail(studentId: any): Promise<any> {
    const student: Student | null = await Student.findByPk(studentId, {
      include: [
        {
          model: Goal,
          as: "Goals"
        },
        {
          model: GreenCard,
          as: "GreenCards"
        },
        {
          model: User
        }
      ]
    });
    if (student === null) {
      throw new ClientError(StatusCodes.NOT_FOUND, `Student with id ${studentId} not found`)
    }
    const dto = {
      photoFileName: student?.photoFileName,
      firstName: student.User.firstName,
      lastName: student.User.lastName,
      shirtNumber: student.shirtNumber,
      fieldPosition: student.fieldPosition,
      goals: student.Goals.length,
      greenCards: student.GreenCards.length,
      shieldFileName: student.Team.School.shieldFileName,
    }
  }
}

export default StudentService;
