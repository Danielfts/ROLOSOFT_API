import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import JSONResponse from "../dtos/JSONResponse";
import MatchService from "../services/MatchService";
import { StatusCodes } from "http-status-codes";
import GoalDTO from "../dtos/goalDTO";
import { v4 as uuidv4 } from "uuid";
import MatchDetailDTO from "../dtos/matchDetailDTO";
import matchDTO from "../dtos/matchDTO";

class MatchController {

  public static async getAllMatchesByTournamentAndSchool(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.body.me.userId;
      await UserService.validateUser(userId);
      const tournamentId: any = req.params.tournamentId;
      const schoolId: any = req.params.schoolId;
      const result: MatchDetailDTO[] = await MatchService.getAllMatchesByTournament(
        tournamentId,
        schoolId
      );
      const response: JSONResponse = {
        success: true,
        message: `Matches for tournament with id ${tournamentId} and school with id ${schoolId} retrieved successfully`,
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async addGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);
      const tournamentId: any = req.params.tournamentId;
      const matchId: any = req.params.matchId;
      const goalDTO: GoalDTO = req.body;

      const result = await MatchService.addGoal(goalDTO, tournamentId, matchId);
      const response: JSONResponse = {
        success: true,
        message: "Goal created successfully",
        data: result,
      };

      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
  public static async getAllMatchesByTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId);
      const tournamentId: any = req.params.tournamentId;
      const data: MatchDetailDTO[] =
        await MatchService.getAllMatchesByTournament(tournamentId);

      const response: JSONResponse = {
        success: true,
        message: `Matches for tournament ${tournamentId} retrieved successfully`,
        data: data,
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }


  public static async createMatch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);

      const matchDTO: any = req.body;
      const phaseName: any = req.params.phaseName;
      const tournamentId: any = req.params.tournamentId;

      const result = await MatchService.createMatch(
        matchDTO,
        tournamentId,
        phaseName
      );

      const response: JSONResponse = {
        success: true,
        message: "Match created",
        data: result,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default MatchController;
