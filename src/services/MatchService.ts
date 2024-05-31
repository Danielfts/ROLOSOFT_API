import { UUID } from "crypto";
import matchDTO from "../dtos/matchDTO";
import Match from "../models/Match";
import PhaseService from "./PhaseService";
import TeamService from "./TeamService";
import Phase from "../models/Phase";
import Tournament from "../models/Tournament";
import TournamentService from "./TournamentService";
import ClientError from "../errors/ClientError";
import { StatusCodes } from "http-status-codes";
import { NextFunction } from "express";
import GoalDTO from "../dtos/goalDTO";
import Goal from "../models/Goal";
import { Op, UUIDV4 } from "sequelize";
import Team from "../models/Team";
import MatchDetailDTO from "../dtos/matchDetailDTO";
import School from "../models/School";
import Student from "../models/Student";
import User from "../models/User";
import {goal} from "../dtos/matchDetailDTO"

class MatchService {
  
  public static async addGoal(
    goalDTO: GoalDTO,
    tournamentId: UUID,
    matchId: UUID
  ): Promise<any> {
    const schoolId = goalDTO.school.id;
    const team: Team | null = await Team.findOne({
      where: { schoolId: schoolId },
    });
    if (team === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Couldn't find a school with id ${schoolId} registered on tournament with id ${tournamentId}`
      );
    }
    const createdGoal: Goal = await Goal.create({
      matchId: matchId,
      studentId: goalDTO.student.id,
      teamId: team.id,
      minute: goalDTO.minute,
    });

    return createdGoal;
  }

  private static async validateMatch(matchDTO: matchDTO): Promise<boolean> {
    const schoolA = await TeamService.getOneTeam(matchDTO.schoolA.id!);
    const schoolB = await TeamService.getOneTeam(matchDTO.schoolB.id!);
    const startDate = new Date(matchDTO.startDateTime);
    const endDate = new Date(matchDTO.endDateTime);
    if (!startDate) {
      throw new Error("Start date is required");
    }
    if (!endDate) {
      throw new Error("End date is required");
    }
    if (schoolA.id === schoolB.id) {
      throw new Error("School A and School B must be different teams");
    }
    if (schoolA.tournament.id !== schoolB.tournament.id) {
      throw new Error("Teams must belong to the same tournament");
    }
    if (matchDTO.startDateTime >= matchDTO.endDateTime) {
      throw new Error("Start date must be before end date");
    }
    if (schoolA.school.id === schoolB.school.id) {
      throw new Error("Teams must belong to different schools");
    }

    return true;
  }

  public static async createMatch(
    match: matchDTO,
    tournamentId: UUID,
    phaseName: string
  ): Promise<matchDTO> {
    // await MatchService.validateMatch(match);
    const tournament = await TournamentService.getTournamentById(tournamentId);
    if (tournament === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Couldn't find tournament with id ${tournamentId}`
      );
    }
    const phase = await Phase.findOne({
      where: { tournamentId: tournamentId, name: phaseName },
      include: Tournament,
    });

    if (phase === null) {
      throw new ClientError(
        StatusCodes.NOT_FOUND,
        `Couldn't find phase ${phaseName} registered on tournament with id ${tournamentId}`
      );
    }

    const startDateTime = new Date(match.startDateTime);
    const endDateTime = new Date(match.endDateTime);

    const teamA = await TeamService.getTeamByTournamentAndSchool(
      phase.Tournament.id!,
      match.schoolA.id
    );
    const teamB = await TeamService.getTeamByTournamentAndSchool(
      phase.Tournament.id!,
      match.schoolB.id
    );

    const newMatch: Match = await Match.create({
      teamAId: teamA.id!,
      teamBId: teamB.id!,
      startDate: startDateTime,
      endDate: endDateTime,
      phaseId: phase.id,
    });

    const newDTO: matchDTO = {
      id: newMatch.id!,
      schoolA: teamA,
      schoolB: teamB,
      startDateTime: newMatch.startDate!,
      endDateTime: newMatch.endDate!,
      phase: phase,
    };
    return newDTO;
  }

  public static async getAllMatchesByTournament(
    tournamentId: UUID,
    schoolId?: UUID
  ): Promise<MatchDetailDTO[]> {
    const tournament: Tournament | null = await Tournament.findOne({
      where: {
        id: tournamentId
      }
    })
    let school: School | null = null
    if (!(schoolId === undefined)){
      school = await School.findOne({where: {id: schoolId}})
      if (school === null){
        throw new ClientError(StatusCodes.NOT_FOUND, `School with id ${schoolId} not found`);
      }
    }
    
    if (tournament === null){
      throw new ClientError(StatusCodes.NOT_FOUND, `Tournament with id ${tournamentId} not found`);
    }

    let whereCondition = {}
    if (school !== null){
      whereCondition = {
        [Op.or] : {
          "$TeamA.School.id$" : schoolId,
          "$TeamB.School.id$": schoolId,
        }
      }
    }


    let data = await Match.findAll({
      where: whereCondition,
      include: [
        {
          right: true,
          model: Phase,
          where: {
            "tournamentId" : tournamentId
          }
        },
        {
          model: Team,
          as: "TeamA",
          include: [School]
        },
        {
          model: Team,
          as: "TeamB",
          include: [School]
        },
        {
          model: Goal,
          as: "Goals",
          include: [
            {
              model: Student,
              include: [User]
            },
            {
              model: Team,
              as: "ForTeam"
            }
          ]
        }
      ]
    });

    //TODO FIX DUMMY
    let dataDto = data.map((m) => {
      let goalsInFavorOfA: goal[] = [];
      let goalsInFavorOfB: goal[] = [];
      m.Goals.forEach((g) => {
        const goalDTO: goal = {
          id: g.Student.id,
          name: g.Student.User.firstName,
          lastName: g.Student.User.lastName,
          minute: g.minute,
          playerNumber: g.Student.shirtNumber
        }
        if (g.ForTeam.id === m.TeamA.id){
          goalsInFavorOfA.push(goalDTO)
        } else {
          goalsInFavorOfB.push(goalDTO)
        }
      })
      const dto: MatchDetailDTO = {
        id: m.id,
        dateTimeStart: m.startDate,
        dateTimeEnd: m.endDate,
        teamA: {
          id: m.TeamA.schoolId,
          name: m.TeamA.School.name,
          points: m.TeamA.points,
          shieldImg: undefined,
          goals: goalsInFavorOfA
        },
        teamB: {
          id: m.TeamB.schoolId,
          name: m.TeamB.School.name,
          points: 0,
          shieldImg: undefined,
          goals: goalsInFavorOfB
        },
        isPlaying: true
      };
      return dto;
    });

    return dataDto;
  }
}

export default MatchService;
