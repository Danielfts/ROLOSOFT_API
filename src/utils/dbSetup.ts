import Roles from "../models/Roles";

import GenderService from "../services/GenderService";
import SchoolService from "../services/SchoolService";
import TournamentService from "../services/TournamentService";
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

    const torneo = {
      name: "COPA COLOMBIA",
      startDate: new Date(),
      endDate: new Date(),
      address: {
        address1: "Calle 1",
        address2: "Calle 2",
        city: "Ciudad",
        state: "Estado",
        postalCode: "00000",
        country: "País",
      },
    };
    const torneoCreado = await TournamentService.createTournament(torneo);

    const estudiante = {
      CURP: "123123123",
      firstName: "David",
      lastName: "Beltran",
      email: "david@hotmail.com",
      birthDate: new Date(),
      gender: "MALE",
      role: "student",
      phone: "1231231231",
      password: "caremonda",
      student: {
        fieldPosition: "AGUATERO",
        shirtNumber: 10,
        IMSS: "sdñafjk",
      },
      address: {
        address1: "Calle 1",
        address2: "Calle 2",
        city: "Ciudad",
        state: "Estado",
        postalCode: "00000",
        country: "País",
      },
    };
    const estudianteCreado = await UserService.createUser(estudiante);

    const escuela = {
      number: 10,
      name: "COLEGIO FRESA",
      address: {
        address1: "Calle 1",
        address2: "Calle 2",
        city: "Ciudad",
        state: "Estado",
        postalCode: "00000",
        country: "País",
      },
    };
    const escuelaCreada = await SchoolService.createSchool(escuela);
  
    await SchoolService.registerSchoolInTournament(torneoCreado.id!, escuelaCreada.id!, "CERVEZA AGUILA", [estudianteCreado.id]);

  }

}
