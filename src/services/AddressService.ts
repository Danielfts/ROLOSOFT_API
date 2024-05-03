import { Transaction } from "sequelize";
import addressDTO from "../dtos/addressDTO";
import Address from "../models/Address";

class AddressService {
  public static async createAddress(
    address: addressDTO,
    t: Transaction
  ): Promise<Address> {
    const newAddress = await Address.create({
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      userId: address.userId!,
    } , { transaction: t });
    return newAddress;
  }
}

export default AddressService;
