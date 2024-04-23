import { UUID } from "crypto";
import adminDTO from "../dtos/adminDTO";
import Admin from "../models/Admin";
import { Transaction } from "sequelize";

class AdminService {
  public static async createAdmin(
    userId: UUID,
    adminDTO: adminDTO,
    t?: Transaction
  ): Promise<Admin> {
    const createdAdmin: Admin = await Admin.create({
      id: userId,
      INE: adminDTO.INE,
    });

    return createdAdmin;
  }
}

export default AdminService;
