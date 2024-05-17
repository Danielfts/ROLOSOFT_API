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

class UserController {
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
      const result: { success: boolean; id: string; role: string } =
        await UserService.logIn(email, password);
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
          data: { userId: result.id, token: token },
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
 
     if (registered) {
       throw new ServerError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         "Metodo sin implementar"
       );
     } else {
       const tournamentId = req.params.tournamentId;
       const result = await StudentService.findStudentsNotOnTournament(
         tournamentId
       );
       const response: JSONResponse = {
         success: true,
         message: `Users not registered on tournament ${tournamentId} retrieved successfully`,
         data: result,
       };
       res.status(StatusCodes.OK).json(response);
     }
   } catch (error) {
      next(error);
   }
  }
}

export default UserController;
