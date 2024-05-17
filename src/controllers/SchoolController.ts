import SchoolService from "../services/SchoolService";
import { Request, Response, NextFunction } from "express";
import JSONResponse from "../dtos/JSONResponse";
import SchoolDTO from "../dtos/schoolDTO";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import { UUID } from "crypto";

class SchoolController {
  public static async createSchool(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const school: SchoolDTO = await SchoolService.createSchool(req.body);
      const response: JSONResponse = {
        success: true,
        message: "School created successfully",
        data: school,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async registerSchoolInTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const tournamentId: any = req.params.tournamentId;
      const schoolId: UUID = req.body.school.id;
      const sponsor: string = req.body.sponsor;
      const studentIds: UUID[] = req.body.students;
      const schoolDTO: SchoolDTO =
        await SchoolService.registerSchoolInTournament(
          tournamentId,
          schoolId,
          sponsor,
          studentIds
        );
      const response: JSONResponse = {
        success: true,
        message: "School registered in tournament successfully",
        data: schoolDTO,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getSchools(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId);
      const schools: SchoolDTO[] = await SchoolService.getSchools();
      const response: JSONResponse = {
        success: true,
        message: "Schools retrieved successfully",
        data: schools,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getSchoolsByTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId);
      let registered: boolean = true;
      if (req.query.registered === "true" || req.query.registered === undefined) {
        registered = true;
      } else if (req.query.registered === "false" ) {
        registered = false;
      }

      const tournamentId = req.params.tournamentId;
      let schools: SchoolDTO[];
      let msg: string;
      if (registered) {
        schools = await SchoolService.getSchoolsByTournament(tournamentId);
        msg =
          "Schools in tournament " + tournamentId + " retrieved successfully";
      } else {
        schools = await SchoolService.getSchoolsNotInTournament(tournamentId);
        msg =
          "Schools not in tournament " +
          tournamentId +
          " retrieved successfully";
      }

      const response: JSONResponse = {
        success: true,
        message: msg,
        data: schools,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default SchoolController;
