import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import JSONResponse from "../dtos/JSONResponse";
import MatchService from "../services/MatchService";
import { StatusCodes } from "http-status-codes";

class MatchController {
  public static async createMatch(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);

      const matchDTO = req.body;
      if (!matchDTO.phase){
        matchDTO.phase = {
          id: req.params.phaseId
        }
      }

      const result = await MatchService.createMatch(req.body);

      const response : JSONResponse = {
        success: true,
        message: "Match created",
        data: result
      }
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default MatchController;