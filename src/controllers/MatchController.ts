import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import JSONResponse from "../dtos/JSONResponse";
import MatchService from "../services/MatchService";
import { StatusCodes } from "http-status-codes";

class MatchController {
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
      const data: any[] = await MatchService.getAllMatchesByTournament(
        tournamentId
      );

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
