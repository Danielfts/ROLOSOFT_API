import { NextFunction, Request, Response } from "express";
import PhaseService from "../services/PhaseService";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import phaseDTO from "../dtos/phaseDTO";
import JSONResponse from "../dtos/JSONResponse";
import { StatusCodes } from "http-status-codes";

class PhaseController {
  public static async createPhase(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);

      const result: phaseDTO = await PhaseService.createPhase(req.body);
      const response: JSONResponse = {
        success: true,
        message: "Phase created successfully",
        data: result,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default PhaseController;
