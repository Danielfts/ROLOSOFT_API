import { UUID } from "crypto";
import GoalTableRowDTO from "../dtos/goalTableRowDTO";
import Student from "../models/Student";
import User from "../models/User";
import Goal from "../models/Goal";
import Team from "../models/Team";
import School from "../models/School";
import Tournament from "../models/Tournament";
import ClientError from "../errors/ClientError";
import { StatusCodes } from "http-status-codes";
import GreenCard from "../models/GreenCard";

class GoalTableService {
  public static async getGoalTable(
    tournamentId: UUID
  ): Promise<GoalTableRowDTO[]> {
    const tournament : Tournament | null = await Tournament.findOne({
      where: {
        id: tournamentId
      }
    })

    if (tournament === null){
      throw new ClientError(StatusCodes.NOT_FOUND, `Couldn't find tournament with id ${tournamentId}`)
    }

    let goalTable: GoalTableRowDTO[] = [];
    //Logic to get the goal table
    const students = await User.findAll({
      include: [
        {
          model: Student,
          right: true,
          include: [
            {
              model: GreenCard,
              as: "GreenCards"
            },
            {
              model: Goal,
              as: "Goals",
            },
            {
              model: Team,
              right: true,
              where: {
                tournamentId: tournamentId,
              },
              include: [{ model: School }],
            },
          ],
        },
      ],
    });

    students.sort((a, b) => {
      const goalsA = a.Student?.Goals?.length || 0;
      const goalsB = b.Student?.Goals?.length || 0;
      return goalsB - goalsA;
    });
    let position = 1;
    goalTable = students.map((student) => {
      const goals = student.Student?.Goals || [];
      const team = student.Student?.Team || { name: "No team" };
      const studentDTO: GoalTableRowDTO = {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        teamName: team.School?.name || "No school",
        goals: goals.length,
        position: position,
        points:  student.Student.GreenCards.length,
        schoolId: team.School?.id || "",
        photoFileName: student.Student.photoFileName || "",
        shieldFileName: student.Student.Team?.School.shieldFileName || "",
      };
      position++;
      return studentDTO;
    });

    return goalTable;
  }
}

export default GoalTableService;
