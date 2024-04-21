import { UserEntity } from "../entities/userEntity";
import User from "../models/User";
import { isValidEmail } from "../utils/inputValidation";
import bcrypt from "bcryptjs";

class UserService {
  public static async deleteUser(id: string): Promise<boolean> {
    const deletedRows: number = await User.destroy({ where: { id: id } });
    if (deletedRows > 0) {
      return true;
    } else {
      return false;
    }
  }
  public static async getAllUsers(): Promise<any[]> {
    const users = await User.findAll();
    return users;
  }

  public static async createUser(user: UserEntity): Promise<any> {
    if (!(await isValidEmail(user.email))) {
      throw new Error("Invalid email address");
    }

    const isUnique: boolean = (await User.findOne({
      where: { email: user.email },
    }))
      ? false
      : true;
    if (!isUnique) {
      throw new Error("Email already exists");
    }

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(user.password_token, salt);
    user.password_token = hashedPassword;
    let createdUser = await User.create({
      email: user.email,
      password_token: user.password_token,
    });

    return createdUser;
  }

  public static async logIn(email: string, password: string): Promise<boolean> {
    const user: any = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password_token
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return true;
  }
}

export default UserService;
