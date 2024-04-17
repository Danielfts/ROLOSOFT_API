import { UserEntity } from "../entities/userEntity";
import { User } from "../model/user";

class UserService {
  public static async getAllUsers() {
      const users = await User.findAll();
    return users;
  }

  public static async createUser(user: UserEntity) {
    const createdUser  = await User.create({
        email: user.email,
        password_token: user.password_token,
        });
    return createdUser;
  }
}

export default UserService;
