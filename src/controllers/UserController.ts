import { Request, Response, NextFunction } from "express";
import UserDTO from "../dtos/userDTO";
import UserService from "../services/UserService";
import { StatusCodes } from "http-status-codes";

class UserController {
  public static async logIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const result: { success: boolean; id: string } = await UserService.logIn(
        email,
        password
      );

      if (result.success) {
        res
          .status(StatusCodes.OK)
          .json({ message: "User logged in successfully", id: result.id });
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
      res.status(StatusCodes.CREATED).json(createdUser);
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserController;
