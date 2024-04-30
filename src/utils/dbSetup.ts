import Address from "../models/Address";
import Admin from "../models/Admin";
import Gender from "../models/Gender";
import Parent from "../models/Parent";
import Roles from "../models/Roles";
import Student from "../models/Student";
import User from "../models/User";
import GenderService from "../services/GenderService";
import UserService from "../services/UserService";

export async function setupDatabase(): Promise<void> {
  const mode = process.env.NODE_ENV;
  await GenderService.setupGenders();

  if (mode === "development" || true) {
    const admin: User | null = await UserService.getUserByEmail("admin@hotmail.com");
    if (admin === null) {
      await UserService.createUser({
        firstName: "Admin",
        lastName: "",
        email: "admin@hotmail.com",
        password: "admin",
        birthDate: new Date(),
        gender: "MALE",
        phone: "0000000000",
        role: Roles.admin,
        CURP: "AAAAAAAAA",
      });
    }
  }
}
