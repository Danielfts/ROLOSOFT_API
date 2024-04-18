import UserService from "../service/userService";
import { StatusCodes } from "http-status-codes";


class UserController {
  public static async logIn(req: any, res: any): Promise<void> {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const success: boolean = await UserService.logIn(email, password);

      if (success) {
        res.status(StatusCodes.OK).send("User logged in successfully");
      }
    } catch (error: any) {
      switch (error.message) {
        case "User not found":
          res.status(StatusCodes.NOT_FOUND).send("User not found");
          break;
        case "Invalid password":
          res.status(StatusCodes.UNAUTHORIZED).send("Invalid password");
          break;
        default:
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
      }
    }
  }

  public static async deleteUser(req: any, res: any): Promise<void> {
    const id: string = req.params.id;
    const success: boolean = await UserService.deleteUser(id);
    if (success) {
      res.status(StatusCodes.OK).send("User deleted successfully");
    } else {
      res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
  }

  public static async getAllUsers(req: any, res: any): Promise<void> {
    try {
        const users = await UserService.getAllUsers();
        res.status(StatusCodes.OK).send(users);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
  }

  public static async createUser(req: any, res: any): Promise<void> {
    try {
        const user = req.body;
        const createdUser = await UserService.createUser(user);
        res.status(StatusCodes.CREATED).send(createdUser);
    } catch (error:any) {
        switch (error.message) {
            case "Invalid email address":
                res.status(StatusCodes.BAD_REQUEST).send("Invalid email address");
                break;
            case "Email already exists":
                res.status(StatusCodes.BAD_REQUEST).send("Email already exists");
                break;
            default:
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
            }
    }
  }
}

export default UserController;
