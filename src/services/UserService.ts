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
import Role from "../models/Roles";
import AddressService from "./AddressService";
import Address from "../models/Address";
import Team from "../models/Team";

class UserService {
  public static async deleteUser(id: string): Promise<boolean> {
    const deletedRows: number = await User.destroy({ where: { id: id } });
    if (deletedRows > 0) {
      return true;
    } else {
      throw new ClientError(StatusCodes.NOT_FOUND, "User not found", {});
    }
  }

  public static async getOneUserDTO(id: UUID | string): Promise<UserDTO> {
    const user: User | null = await User.findOne({
      where: { id: id },
      include: [Gender],
    });
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
      CURP: user.CURP,
      address: await user.getAddress({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      }),
    };

    switch (user.role) {
      case Roles.student:
        const student = await user.getStudent({
          include: [Team],
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
          },
        });
        userDTO.student = StudentService.mapStudent(student);
        break;
      case Roles.admin:
        const admin = await user.getAdmin();
        break;
    }
    return userDTO;
  }

  public static async getAllUsers(): Promise<any[]> {
    const users = await User.findAll({
      include: [Gender, Address],
      attributes: {
        exclude: [
          "password",
          "gender",
          "photo",
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
        CURP: user.CURP,
        address: {
          address1: user.Address.address1,
          address2: user.Address.address2,
          city: user.Address.city,
          state: user.Address.state,
          postalCode: user.Address.postalCode,
          country: user.Address.country,
        },
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

    // VALIDATE ADDRESS

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
      //CREATE AN ADDRESS
      let createdAddress: Address | null = null;
      if (user.address) {
        createdAddress = await AddressService.createAddress(user.address!, t);
      }

      //CREATE A USER

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
          CURP: user.CURP,
          addressId: user.address ? createdAddress?.id : null,
        },
        { transaction: t }
      );

      //CREATE A STUDENT
      switch (user.role) {
        case Roles.student:
          if (!user.student) {
            throw new ClientError(
              StatusCodes.BAD_REQUEST,
              "Student data is required"
            );
          }
          const createdStudent: Student = await StudentService.createStudent(
            createdUser.id,
            user.student,
            t
          );
          break;
        case Roles.admin:
          const createdAdmin: Admin = await AdminService.createAdmin(
            createdUser.id,
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
  ): Promise<{ success: boolean; id: string; role: string }> {
    const user: User | null = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new ClientError(StatusCodes.NOT_FOUND, "User not found");
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new ClientError(StatusCodes.UNAUTHORIZED, "Invalid password");
    }
    return { success: true, id: user.id.toString(), role: user.role };
  }

  public static async validateUser(id: string | UUID, role?: Role) {
    const user = await UserService.getOneUserDTO(id);
    if (role && user.role !== role) {
      throw new ClientError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to perform this operation"
      );
    }
    return user;
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email: email } });
  }
}

export default UserService;
