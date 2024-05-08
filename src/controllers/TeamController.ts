import { NextFunction, Request, Response } from "express";
import TeamService from "../services/TeamService";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import User from "../models/User";
import teamDTO from "../dtos/teamDTO";
import JSONResponse from "../dtos/JSONResponse";
import { StatusCodes } from "http-status-codes";
import { UUID } from "crypto";
import { Json } from "sequelize/types/utils";

class TeamController {
  static async getOneTeam(req: Request, res: Response, next: NextFunction) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId);
      const id: any = req.params.id;
      const result: teamDTO = await TeamService.getOneTeam(id);
      const response: JSONResponse = {
        success: true,
        message: "Team retrieved",
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  public static async createTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);

      const createdTeam: teamDTO = await TeamService.createTeam(req.body);
      const result: JSONResponse = {
        data: createdTeam,
        success: true,
        message: "Team created successfully",
      };
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllTeams(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId);

      const teams: teamDTO[] = await TeamService.getAllTeams();
      const response: JSONResponse = {
        success: true,
        message: "All teams retrieved",
        data: teams,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default TeamController;
