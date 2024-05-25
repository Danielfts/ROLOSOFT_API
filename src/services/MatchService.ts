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
import { UUIDV4 } from "sequelize";
import Team from "../models/Team";

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
    tournamentId: UUID
  ): Promise<any[]> {
    let data = await Match.findAll({
      where: {
        "$Phase.Tournament.id$": tournamentId,
      },
      include: [{ model: Phase, include: [Tournament] }, ""],
    });

    //TODO FIX DUMMY
    let dataDto = data.map((m) => {
      const dto = {
        id: m.id,
        startDate: m.startDate,
        endDate: m.endDate,
        teamA: {
          id: "",
        },
        teamB: {
          id: "",
        },
      };
    });
    return data;
  }
}

export default MatchService;
