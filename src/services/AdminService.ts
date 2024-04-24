import { UUID } from "crypto";
import adminDTO from "../dtos/adminDTO";
import Admin from "../models/Admin";
import { Transaction } from "sequelize";

class AdminService {
  public static async createAdmin(
    userId: UUID,
    t?: Transaction
  ): Promise<Admin> {
    const createdAdmin: Admin = await Admin.create({
      id: userId,
    }, { transaction: t });

    return createdAdmin;
  }
}

export default AdminService;
