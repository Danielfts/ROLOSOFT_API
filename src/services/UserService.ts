import UserDTO from "../dtos/userDTO";
import Gender from "../models/Gender";
import User from "../models/User";
import { isValidEmail } from "../utils/inputValidation";
import bcrypt from "bcryptjs";
import Roles from "../models/Roles";
import StudentService from "./StudentService";
import { sequelize } from "../config/db";
import Student from "../models/Student";
import StudentDTO from "../dtos/studentDTO";
import ClientError from "../errors/ClientError";
import { StatusCodes } from "http-status-codes";
import AdminService from "./AdminService";
import Admin from "../models/Admin";
import { UUID } from "crypto";

class UserService {
  public static async deleteUser(id: string): Promise<boolean> {
    const deletedRows: number = await User.destroy({ where: { id: id } });
    if (deletedRows > 0) {
      return true;
    } else {
      throw new ClientError(StatusCodes.NOT_FOUND, "User not found", {});
    }
  }

  public static async getOneUserDTO(id: UUID): Promise<UserDTO> {
    const user: User | null = await User.findOne({where: {id: id}, include: [Gender]});
    if (!user) {
      throw new ClientError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userDTO: UserDTO = {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate, 
      gender: user.Gender.name,
      role: user.role,
    };

    switch (user.role) {
      case Roles.student:
        const student = await user.getStudent({attributes: {exclude: ["id","createdAt", "updatedAt", "deletedAt"]}});
        userDTO.student = student;
        break;
      case Roles.admin:
        const admin = await user.getAdmin();
        userDTO.admin = {INE: admin.INE};
        break;
    }
    return userDTO;
  }

  public static async getAllUsers(): Promise<any[]> {
    const users = await User.findAll({
      include: Gender,
      attributes: {
        exclude: [
          "password",
          "gender",
          "photo",
          "address",
          "createdAt",
          "updatedAt",
          "deletedAt",
        ],
      },
    });
    const usersDTO: UserDTO[] = users.map((user: User) => {
      return {
        id: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.Gender.name,
        role: user.role,
      };
    });
    return usersDTO;
  }

  public static async createUser(user: UserDTO): Promise<User> {
    // Validate Email 
    if (!(await isValidEmail(user.email))) {
      throw new ClientError(StatusCodes.BAD_REQUEST, "Invalid email address");
    }
    // Validate Email is unique
    const isUnique: boolean = (await User.findOne({
      where: { email: user.email },
    }))
      ? false
      : true;
    if (!isUnique) {
      throw new ClientError(StatusCodes.BAD_REQUEST, "Email already exists");
    }
    
    // CHECK GENDER
    let gender: Gender | null;
    gender = await Gender.findOne({
      where: { name: user.gender },
    });
    if (gender === null) {
      throw new ClientError(StatusCodes.BAD_REQUEST, "Gender not found");
    }
    
    // CHECK if role is in enum
    if (!(user.role in Roles)) {
      throw new ClientError(StatusCodes.BAD_REQUEST, "Role not found");
    }

    // Encrypt Password
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(user.password!, salt);
    user.password = hashedPassword;

    const result: User = await sequelize.transaction(async (t) => {
      let createdUser = await User.create(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password!,
          birthDate: user.birthDate,
          phone: user.phone,
          role: user.role,
          genderId: gender.id,
        },
        { transaction: t }
      );

      //CREATE A STUDENT
      switch (user.role) {
        case Roles.student:
          if (!user.student) {
            throw new ClientError(StatusCodes.BAD_REQUEST,"Student data is required");
          }
          const createdStudent: Student = await StudentService.createStudent(
            createdUser.id,
            user.student,
            t
          );
          break;
        case Roles.admin:
          if (!user.admin) {
            throw new ClientError(StatusCodes.BAD_REQUEST, "Admin data is required");
          }
          const createdAdmin: Admin = await AdminService.createAdmin(
            createdUser.id,
            user.admin,
            t
          );
          break;
        default:
          throw new ClientError(StatusCodes.NOT_FOUND, "Role not found");
      }
      return createdUser;
    });

    return result;
  }

  public static async logIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; id: string ; role: string}> {
    const user: User | null = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new ClientError(StatusCodes.NOT_FOUND, "User not found");
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new ClientError(StatusCodes.BAD_REQUEST, "Invalid password");
    }
    return { success: true, id: user.id.toString() , role: user.role};
  }
}

export default UserService;
