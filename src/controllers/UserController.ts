import UserDTO from "../dtos/userDTO";
import UserService from "../services/UserService";
import { StatusCodes } from "http-status-codes";

class UserController {
  public static async logIn(req: any, res: any): Promise<void> {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const result: {success: boolean, id: string} = await UserService.logIn(email, password);

      if (result.success) {
        res.status(StatusCodes.OK).send({message:"User logged in successfully", id: result.id});
      }
    } catch (error: any) {
      console.error(error.message);
      switch (error.message) {
        case "User not found":
          res.status(StatusCodes.NOT_FOUND).send({message: "User not found"});
          break;
        case "Invalid password":
          res.status(StatusCodes.UNAUTHORIZED).send({message: "Invalid password"});
          break;
        case "Gender not found":
          res.status(StatusCodes.BAD_REQUEST).send({message: "Gender not found"});
        default:
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({message: "Internal Server Error"});
      }
    }
  }

  public static async deleteUser(req: any, res: any): Promise<void> {
    const id: string = req.params.id;
    const success: boolean = await UserService.deleteUser(id);
    if (success) {
      res.status(StatusCodes.OK).send({message: "User deleted successfully"});
    } else {
      res.status(StatusCodes.NOT_FOUND).send({message: "User not found"});
    }
  }

  public static async getAllUsers(req: any, res: any): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(StatusCodes.OK).send(users);
    } catch (error:any) {
      console.error(error.message);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({message: "Internal Server Error"});
    }
  }

  public static async createUser(req: any, res: any): Promise<void> {
    try {
      const user: UserDTO = req.body;
      const createdUser = await UserService.createUser(user);
      res.status(StatusCodes.CREATED).send(createdUser);
    } catch (error: any) {
      console.log(error.message);
      switch (error.message) {
        case "Invalid email address":
          res.status(StatusCodes.BAD_REQUEST).send({message: "Invalid email address"});
          break;
        case "Email already exists":
          res.status(StatusCodes.BAD_REQUEST).send({message: "Email already exists"});
          break;
        default:
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({message: "Internal Server Error"});
      }
    }
  }
}

export default UserController;
