import SchoolService from "../services/SchoolService";
import { Request, Response, NextFunction } from "express";
import JSONResponse from "../dtos/JSONResponse";
import SchoolDTO from "../dtos/schoolDTO";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import { UUID } from "crypto";
import TeamService from "../services/TeamService";
import School from "../models/School";

class SchoolController {
  public static async setSchoolShield(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const schoolId: any = req.params.schoolId;
      const result: string = await SchoolService.setSchoolShield(
        schoolId,
        req.file
      );

      const response: JSONResponse = {
        success: true,
        message:
          "School shield set successfully for school with id: " +
          schoolId +
          ". Image saved on /static/" +
          result,
        data: { filename: result },
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
  public static async setTeamPoints(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const points: number = req.body.points;
      const tournamentId: any = req.params.tournamentId;
      const schoolId: any = req.params.schoolId;
      const result: number = await TeamService.setTeamPoints(
        tournamentId,
        schoolId,
        points
      );
      if (result === 1) {
        const response: JSONResponse = {
          success: true,
          message: `The points for the team of school with id ${schoolId} on tournament with id ${tournamentId} have been set to ${points}`,
        };
        res.status(StatusCodes.OK).json(response);
      } else {
        const response: JSONResponse = {
          success: false,
          message: `There was an error setting the points for the team of school with id ${schoolId} on tournament with id ${tournamentId}.`,
        };
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
      }
    } catch (error) {
      next(error);
    }
  }
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
      if (
        req.query.registered === "true" ||
        req.query.registered === undefined
      ) {
        registered = true;
      } else if (req.query.registered === "false") {
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
