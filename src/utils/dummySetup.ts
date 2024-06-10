import Address from "../models/Address";
import Gender from "../models/Gender";
import Goal from "../models/Goal";
import GreenCard from "../models/GreenCard";
import Match from "../models/Match";
import Phase from "../models/Phase";
import Roles from "../models/Roles";
import School from "../models/School";
import Student from "../models/Student";
import Team from "../models/Team";
import Tournament from "../models/Tournament";
import User from "../models/User";
import PhaseService from "../services/PhaseService";
import UserService from "../services/UserService";

export async function setupDummy(): Promise<void> {

  // GENDERS
  const genders : Gender[] | null = await Gender.findAll();

  // ADMIN USER
  const adminAddress: Address = await Address.create({
    address1: "Calle 1",
    address2: "Calle 2",
    city: "Ciudad",
    state: "Estado",
    postalCode: "00000",
    country: "País",
  });

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

  const estudianteA = await UserService.createUser({
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
  });

  await GreenCard.create({
    studentId: estudianteA.id!,
    reason: "Muestra de amor al arbitro",
  });

  

  // TOURNAMENT ADDRESS
  const tournamentAddress: Address = await Address.create({
    address1: "Calle 1",
    address2: "Calle 2",
    city: "Ciudad",
    state: "Estado",
    postalCode: "00000",
    country: "País",
  });

  const today : Date = new Date();
  const todayPlusOneMonth : Date = new Date();

  // TOURNAMENT
  todayPlusOneMonth.setMonth(todayPlusOneMonth.getMonth() + 1);
  const tournament: Tournament = await Tournament.create({
    name: "SUPER COPA MEXICO",
    startDate: today,
    endDate: todayPlusOneMonth,
    addressId: tournamentAddress.id!,
  });

  //SCHOOLS
  // THERE ARE 8 SCHOOLS: América, Santa Fe, Pumas, Atlético Nacional, Rayados, Deportivo Cali, Cruz Azul, Millonarios
  // THERE ARE 4 MEXICAN SPONSORS: FEMSA, Bimbo, Telcel, Cemex
  // THERE ARE 4 COLOMBIAN SPONSORS: Postobón, Bavaria, Ecopetrol, Argos
  const schoolAddress: Address = await Address.create({
    address1: "Calle 3",
    address2: "Calle 4",
    city: "Ciudad",
    state: "Estado",
    postalCode: "00000",
    country: "País",
  });

  const schoolAmerica = await School.create({
    number: 1,
    name: "América",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-america.png",
  });

  const teamAmerica = await Team.create({
    schoolId: schoolAmerica.id!,
    tournamentId: tournament.id!,
    sponsor: "FEMSA",
    points: 0,
  });
  
  const schoolSantafe = await School.create({
    number: 2,
    name: "Santa Fe",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-santa-fe.png"
  });

  const teamSantafe = await Team.create({
    schoolId: schoolSantafe.id!,
    tournamentId: tournament.id!,
    sponsor: "Postobón",
    points: 0,
  });

  const createdStudentA = await Student.findByPk(estudianteA.id!);
  createdStudentA!.teamId = teamSantafe.id!;
  await createdStudentA!.save();


  const schoolPumas = await School.create({
    number: 3,
    name: "Pumas",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-pumas.png"
  });

  const teamPumas = await Team.create({
    schoolId: schoolPumas.id!,
    tournamentId: tournament.id!,
    sponsor: "Bimbo",
    points: 0,
  });

  const schoolNacional = await School.create({
    number: 4,
    name: "Atlético Nacional",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-nacional.png"
  });

  const teamNacional = await Team.create({
    schoolId: schoolNacional.id!,
    tournamentId: tournament.id!,
    sponsor: "Bavaria",
    points: 0,
  });

  const schoolRayados = await School.create({
    number: 5,
    name: "Rayados",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-rayados.png"
  });

  const teamRayados = await Team.create({
    schoolId: schoolRayados.id!,
    tournamentId: tournament.id!,
    sponsor: "Telcel",
    points: 0,
  });

  const schoolCali = await School.create({
    number: 6,
    name: "Deportivo Cali",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-depor-cali.png"
  });

  const teamCali = await Team.create({
    schoolId: schoolCali.id!,
    tournamentId: tournament.id!,
    sponsor: "Ecopetrol",
    points: 0,
  });

  const schoolGdl = await School.create({
    number: 7,
    name: "Guadalajara",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-gdl.png"
  });

  const teamGdl = await Team.create({
    schoolId: schoolGdl.id!,
    tournamentId: tournament.id!,
    sponsor: "Cemex",
    points: 0,
  });

  const schoolJunior = await School.create({
    number: 8,
    name: "Atlético Junior",
    addressId: schoolAddress.id!,
    shieldFileName: "escudo-junior.png"
  });

  const teamJunior = await Team.create({
    schoolId: schoolJunior.id!,
    tournamentId: tournament.id!,
    sponsor: "Argos",
    points: 0,
  });

  // PHASES

  const phaseNames: string[] = [
    "CUARTOS_DE_FINAL",
    "FASE_INICIAL",
    "FINAL",
    "SEMIFINAL",
  ];

  for (const p of phaseNames) {
    await Phase.create({
      tournamentId: tournament.id!,
      name: p,
      startDate: new Date(),
      endDate: new Date(),
    });
  }

  // THERE ARE 4 QUARTER FINAL MATCHES: AMERICA VS SANTA FE, PUMAS VS NACIONAL, RAYADOS VS CALI, GDL VS JUNIOR

  const quarterFinals = await Phase.findOne({
    where: {
      name: "CUARTOS_DE_FINAL",
    },
  });

  //  AMERICA VS SANTAFE
  const match1 = await Match.create({
    phaseId: quarterFinals!.id!,
    startDate: new Date(),
    endDate: new Date(),
    teamAId: teamAmerica.id!,
    teamBId: teamSantafe.id!,
  });

  let goal = await Goal.create({
    matchId: match1.id!,
    studentId: estudianteA.id!,
    teamId: teamSantafe.id!,
    minute: 10,
  });
  
  goal = await Goal.create({
    matchId: match1.id!,
    studentId: estudianteA.id!,
    teamId: teamSantafe.id!,
    minute: 20,
  });

  let date:Date = new Date()

  const match2 = await Match.create({
    phaseId: quarterFinals!.id!,
    startDate: new Date(),
    endDate: new Date(),
    teamAId: teamPumas.id!,
    teamBId: teamNacional.id!,
  });

  const match3 = await Match.create({
    phaseId: quarterFinals!.id!,
    startDate: new Date(),
    endDate: new Date(),
    teamAId: teamRayados.id!,
    teamBId: teamCali.id!,
  });

  const match4 = await Match.create({
    phaseId: quarterFinals!.id!,
    startDate: new Date(),
    endDate: new Date(),
    teamAId: teamGdl.id!,
    teamBId: teamJunior.id!,
  });

  // THERE ARE 2 SEMI FINAL MATCHES: SANTE FE VS NACIONAL, RAYADOS VS JUNIOR

  const semiFinals = await Phase.findOne({
    where: {
      name: "SEMIFINAL",
    },
  });
  date.setDate(date.getDate() + 1)
  
  const match5 = await Match.create({
    phaseId: semiFinals!.id!,
    startDate: date,
    endDate: date,
    teamAId: teamSantafe.id!,
    teamBId: teamNacional.id!,
  });

  const match6 = await Match.create({
    phaseId: semiFinals!.id!,
    startDate: date,
    endDate: date,
    teamAId: teamRayados.id!,
    teamBId: teamJunior.id!,
  });
  
  
  // THERE IS 1 FINAL MATCH: SANTA FE VS RAYADOS

  const final = await Phase.findOne({
    where: {
      name: "FINAL",
    },
  });

  date.setDate(date.getDate() + 1)

  const match7 = await Match.create({
    phaseId: final!.id!,
    startDate: date,
    endDate: date,
    teamAId: teamSantafe.id!,
    teamBId: teamRayados.id!,
  });

  return ;
}
