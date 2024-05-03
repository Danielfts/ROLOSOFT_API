
import Roles from "../models/Roles";

import GenderService from "../services/GenderService";
import UserService from "../services/UserService";

export async function setupDatabase(): Promise<void> {
  const mode = process.env.NODE_ENV;
  await GenderService.setupGenders();

  if (mode === "development" || true) {
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
      address: {
        address1: "Calle 1",
        address2: "Calle 2",
        city: "Ciudad",
        state: "Estado",
        postalCode: "00000",
        country: "País",
      }, 
    });
  }
}
