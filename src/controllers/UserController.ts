import { Request, Response, NextFunction } from "express";
import UserDTO from "../dtos/userDTO";
import UserService from "../services/UserService";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import JSONResponse from "../dtos/JSONResponse";
import ServerError from "../errors/ServerError";
import ClientError from "../errors/ClientError";
import Role from "../models/Roles";
import { UUID } from "crypto";
import Roles from "../models/Roles";

class UserController {
  static async validateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
      try {
        await UserController.validateUser(req.body.me.userId);
        res.status(StatusCodes.OK).json({ success: true, message: "Token is valid" });
      } catch (error:any) {
        error = new ClientError(StatusCodes.FORBIDDEN,"Token is invalid");
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
      const result: { success: boolean; id: string; role: string } = await UserService.logIn(
        email,
        password
      );
      const secret : string  | undefined = process.env.JWT_SECRET;
      if ( secret === undefined) {
        throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR,"Secret is required");
      }
      if (result.success) {
        const token:string = jwt.sign({ userId: result.id }, secret, {expiresIn: "1d"});
        const response: JSONResponse = {
          success: true,
          message: "User logged in successfully",
          data: { userId: result.id, token: token },
          
        };
        res
          .status(StatusCodes.OK)
          .json(response);
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
      await UserController.validateUser(userId, Role.admin);
      //DELETE USER
      const id: string = req.params.id;
      const success: boolean = await UserService.deleteUser(id);
      if (success) {
        res
          .status(StatusCodes.OK)
          .json({ message: "User deleted successfully" });
      }
    } catch (error) {
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
      await UserController.validateUser(userId, Role.admin);
      //GET ALL USERS
      const users = await UserService.getAllUsers();
      res.status(StatusCodes.OK).json(users);
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
      await UserController.validateUser(userId, Role.admin);
      //CREATE USER
      const user: UserDTO = req.body;
      const createdUser = await UserService.createUser(user);
      const userDTO = await UserService.getOneUserDTO(createdUser.id);
      res.status(StatusCodes.CREATED).json(userDTO);
    } catch (error: any) {
      next(error);
    }
  }

  public static async validateUser(id: string | UUID, role?: Role) {
    const user = await UserService.getOneUserDTO(id);
    if (role && user.role !== role) {
      throw new ClientError(StatusCodes.FORBIDDEN,"You are not authorized to perform this operation");
    }
    return user;
  }
}

export default UserController;
