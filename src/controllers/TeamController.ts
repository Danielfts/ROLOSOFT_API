import { NextFunction, Request, Response } from "express";
import TeamService from "../services/TeamService";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import User from "../models/User";
import teamDTO from "../dtos/teamDTO";
import JSONResponse from "../dtos/JSONResponse";
import { StatusCodes } from "http-status-codes";

class TeamController {

    public static async createTeam (
        req: Request,
        res: Response,
        next: NextFunction
    ) {
      try {
        //VALIDATE
        const userId = req.body.me.userId;
        await UserService.validateUser(userId, Roles.admin);
  
        const createdTeam : teamDTO =  await TeamService.createTeam(req.body);
        const result : JSONResponse = {
          data: createdTeam,
          success: true,
          message: "Team created successfully"
        }
        res.status(StatusCodes.CREATED).json(result);
  
      } catch (error) {
        next(error);
      }
    }
}

export default TeamController;