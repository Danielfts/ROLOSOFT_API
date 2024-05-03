import { Transaction } from "sequelize";
import addressDTO from "../dtos/addressDTO";
import Address from "../models/Address";

class AddressService {
  public static async createAddress(
    address: addressDTO,
    t: Transaction
  ): Promise<Address> {
    const newAddress = await Address.create(address, { transaction: t });
    return newAddress;
  }
}

export default AddressService;
