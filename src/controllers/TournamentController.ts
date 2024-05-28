import { NextFunction, Request, Response } from "express";
import TournamentService from "../services/TournamentService";
import JSONResponse from "../dtos/JSONResponse";
import UserService from "../services/UserService";
import { StatusCodes } from "http-status-codes";
import tournamentDTO from "../dtos/tournamentDTO";
import Roles from "../models/Roles";
import GeneralTableService from "../services/GeneralTableService";
import GoalTableService from "../services/GoalTableService";
import GoalTableRowDTO from "../dtos/goalTableRowDTO";

class TournamentController {
  static async searchStudentsAndSchools(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId);
      const searchTerm: any = req.query.searchTerm;
      const tournamentId: any = req.params.tournamentId;
      const result = await TournamentService.searchStudentsAndSchools(
        searchTerm,
        tournamentId
      );
      const response: JSONResponse = {
        success: true,
        message: "Search successfull",
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  public static async getAllTournaments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId);
      const tournaments = await TournamentService.getAllTournaments();
      const response: JSONResponse = {
        success: true,
        message: "OK",
        data: tournaments,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async createTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const tournamentDTO: tournamentDTO = req.body;
      const tournament = await TournamentService.createTournament(
        tournamentDTO
      );
      const response: JSONResponse = {
        success: true,
        message: "Tournament created",
        data: tournament,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getGeneralTable(
    req: Request,
    res: Response,
    next: NextFunction
  ){

    try {
      await UserService.validateUser(req.body.me.userId);
      const tournamentId: any = req.params.tournamentId;
      const generalTable = await GeneralTableService.getGeneralTable(tournamentId);
      const response: JSONResponse = {
        success: true,
        message: `General table for tournament with id ${tournamentId} retrieved successfully`,
        data: generalTable,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getGoalTable(
    req: Request,
    res: Response,
    next: NextFunction
  ){

    try {
      await UserService.validateUser(req.body.me.userId);
      const tournamentId: any = req.params.tournamentId;
      const goalTable: GoalTableRowDTO[] = await GoalTableService.getGoalTable(tournamentId);
      const response: JSONResponse = {
        success: true,
        message: `Goal table for tournament with id ${tournamentId} retrieved successfully`,
        data: goalTable,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default TournamentController;
