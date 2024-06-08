import { Request, Response, NextFunction } from "express";
import UserDTO from "../dtos/userDTO";
import UserService from "../services/UserService";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import JSONResponse from "../dtos/JSONResponse";
import ServerError from "../errors/ServerError";
import ClientError from "../errors/ClientError";
import Roles from "../models/Roles";
import StudentService from "../services/StudentService";
import { boolean } from "joi";
import { UUID } from "crypto";

class UserController {
  public static async uploadPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const studentId: any = req.params.studentId;
      const result = await StudentService.setPhotoFileName(studentId, req.file);
      const response: JSONResponse = {
        success: true,
        message:
          "Profile picture set successfully for student with id: " +
          studentId +
          ". Image saved on /static/" +
          result,
        data: { filename: result },
      };
      
      res.status(StatusCodes.CREATED).json(response);

    } catch (error) {
      next(error)
    }
  }
  public static async getStudentsByTournamentAndSchool(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);
      const tournamentId: any = req.params.tournamentId;
      const schoolId: any = req.params.schoolId;
      const result = await StudentService.findStudentsByTournamentAndSchool(tournamentId, schoolId);
      const response: JSONResponse = {
        success: true,
        message: `Students registered on tournament with id ${tournamentId}, and school with id ${schoolId} retrieved successfully`,
        data: result
      }
      res.status(StatusCodes.OK).json(response)
    } catch (error) {
      next(error);
    }
  }
  public static async addStudentToTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.validateUser(req.body.me.userId, Roles.admin);

      const studentId: any = req.params.studentId;
      const tournamentId: any = req.params.tournamentId;
      const schoolId: any = req.params.schoolId;

      await StudentService.registerStudentOnTeam(
        studentId,
        tournamentId,
        schoolId
      );
      const response: JSONResponse = {
        success: true,
        message: `Student with id ${studentId} registered successfully with school ${schoolId} on tournament ${tournamentId}`,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.validateUser(req.body.me.userId);
      const response: JSONResponse = {
        success: true,
        message: "Token is valid",
        data: null,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      error = new ClientError(StatusCodes.FORBIDDEN, "Token is invalid");
      next(error);
    }
  }
  public static async logIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const result: {
        success: boolean;
        id: string;
        role: string;
        tournamentId?: UUID;
        schoolId?: UUID;
      } = await UserService.logIn(email, password);
      const secret: string | undefined = process.env.JWT_SECRET;
      if (secret === undefined) {
        throw new ServerError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Secret is required"
        );
      }
      if (result.success) {
        const token: string = jwt.sign({ userId: result.id }, secret, {
          expiresIn: "1d",
        });
        const response: JSONResponse = {
          success: true,
          message: "User logged in successfully",
          data: {
            userId: result.id,
            token: token,
            tournamentId: result.tournamentId,
            schoolId: result.schoolId,
          },
        };
        res.status(StatusCodes.OK).json(response);
      }
    } catch (error: any) {
      next(error);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);
      //DELETE USER
      const id: string = req.params.id;
      const success: boolean = await UserService.deleteUser(id);
      if (success) {
        const response: JSONResponse = {
          success: true,
          message: "User deleted successfully",
          data: null,
        };
        res.status(StatusCodes.OK).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  public static async getMyself(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      const user: UserDTO = await UserService.validateUser(userId);
      //GET USER
      const response: JSONResponse = {
        success: true,
        message: "User found",
        data: user,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      next(error);
    }
  }

  public static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);
      //GET ALL USERS
      const users = await UserService.getAllUsers();
      const response: JSONResponse = {
        success: true,
        message: "Users found",
        data: users,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      next(error);
    }
  }

  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);
      //CREATE USER
      const user: UserDTO = req.body;
      const createdUser = await UserService.createUser(user);
      const userDTO = await UserService.getOneUserDTO(createdUser.id);
      const response: JSONResponse = {
        success: true,
        message: "User created successfully",
        data: userDTO,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error: any) {
      next(error);
    }
  }

  public static async getStudentsByTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let registeredParam: boolean = req.query.registered ? true : false;
      let registered: boolean = true;

      if (registeredParam && req.query.registered === "false") {
        registered = false;
      }

      const tournamentId = req.params.tournamentId;
      let result: any[];
      let msg: string;
      if (registered) {
        result = await StudentService.findStudentsByTournament(tournamentId);
        msg = `Users registered on tournament ${tournamentId} retrieved successfully`;
      } else {
        result = await StudentService.findStudentsNotOnTournament(tournamentId);
        msg = `Users not registered on tournament ${tournamentId} retrieved successfully`;
      }
      const response: JSONResponse = {
        success: true,
        message: msg,
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async addGreenCardToStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.body.me.userId;
      const reason: string = req.body.reason;
      const studentId: any = req.params.studentId;
      await UserService.validateUser(userId, Roles.admin);
      const result = await StudentService.addGreenCardToStudent(studentId, reason);
      const response : JSONResponse  = {
        success: true,
        message: `Success adding green card to student with id ${studentId}`,
        data: result,
      }
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error)
    }
  }
}

export default UserController;
