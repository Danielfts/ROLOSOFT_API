import matchDTO from "../dtos/matchDTO";
import Phase from "../models/Phase";
import Roles from "../models/Roles";

import GenderService from "../services/GenderService";
import MatchService from "../services/MatchService";
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

    const estudianteA = {
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
    const estudianteCreadoA = await UserService.createUser(estudianteA);
    
    const estudianteB = {
      CURP: "123123124",
      firstName: "Daniel",
      lastName: "Triviño",
      email: "daniel@hotmail.com",
      birthDate: new Date(),
      gender: "MALE",
      role: "student",
      phone: "1231231231",
      password: "caremonda",
      student: {
        fieldPosition: "GOLEADOR",
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
    const estudianteCreadoB = await UserService.createUser(estudianteB);

    const escuelaA = {
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
    const escuelaCreadaA = await SchoolService.createSchool(escuelaA);
    
    const escuelaB = {
      number: 20,
      name: "COLEGIO GOMELO",
      address: {
        address1: "Calle 3",
        address2: "Calle 4",
        city: "Ciudad",
        state: "Estado",
        postalCode: "00000",
        country: "País",
      },
    };
    const escuelaCreadaB = await SchoolService.createSchool(escuelaA);
  
    await SchoolService.registerSchoolInTournament(torneoCreado.id!, escuelaCreadaA.id!, "CERVEZA AGUILA", [estudianteCreadoA.id]);
    
    await SchoolService.registerSchoolInTournament(torneoCreado.id!, escuelaCreadaB.id!, "CERVEZA AGUILA", [estudianteCreadoB.id]);

    let match: matchDTO = {
      startDateTime: new Date(),
      endDateTime: new Date(),
      schoolA: {
        id: escuelaCreadaA.id
      },
      schoolB: {
        id: escuelaCreadaB.id
      },
    }
    const matchCreado = await  MatchService.createMatch(match,torneoCreado.id!, "FASE_INICIAL")
    await  MatchService.createMatch(match,torneoCreado.id!, "FASE_INICIAL")
    await  MatchService.createMatch(match,torneoCreado.id!, "FASE_INICIAL")

    const gol = {
      student: {
        id: estudianteCreadoA.id!
      },
      school: {
        id: escuelaCreadaA.id!
      },
      minute: 10
    };
    await MatchService.addGoal(gol,torneoCreado.id!, matchCreado.id!)
    await MatchService.addGoal(gol,torneoCreado.id!, matchCreado.id!)
    await MatchService.addGoal(gol,torneoCreado.id!, matchCreado.id!)
    await MatchService.addGoal(gol,torneoCreado.id!, matchCreado.id!)
  }

}
