import { NextFunction, Request, Response } from "express";
import PhaseService from "../services/PhaseService";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import phaseDTO from "../dtos/phaseDTO";
import JSONResponse from "../dtos/JSONResponse";
import { StatusCodes } from "http-status-codes";
import SoccerStages from "../models/SoccerStages";
import { Json } from "sequelize/types/utils";

class PhaseController {
  static async getAllPhasesByTournament(req: Request, res: Response, next: NextFunction) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId);

      const tournamentId: string = req.params.tournamentId;
      const result: phaseDTO[] = await PhaseService.getTournamentPhases(
        tournamentId
      );
      const response: JSONResponse = {
        success: true,
        message: "Phases retrieved successfully",
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  
}

export default PhaseController;
