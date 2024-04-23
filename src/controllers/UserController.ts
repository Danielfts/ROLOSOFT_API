import { Request, Response, NextFunction } from "express";
import UserDTO from "../dtos/userDTO";
import UserService from "../services/UserService";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import JSONResponse from "../dtos/JSONResponse";

class UserController {
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
      
      if (result.success) {
        const token:string = jwt.sign({ id: result.id }, process.env.JWT_SECRET!, {expiresIn: "1d"});
        const response: JSONResponse = {
          success: true,
          message: "User logged in successfully",
          data: { id: result.id, token: token },
          
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
      const user: UserDTO = req.body;
      const createdUser = await UserService.createUser(user);
      const userDTO = await UserService.getOneUserDTO(createdUser.id);
      res.status(StatusCodes.CREATED).json(userDTO);
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserController;
