import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";
import TeamController from "../controllers/TeamController";
import PhaseController from "../controllers/PhaseController";
import MatchController from "../controllers/MatchController";
import SchoolController from "../controllers/SchoolController";
import UserController from "../controllers/UserController";

const tournamentRouter = Router();

// TOURNAMENTS
tournamentRouter.get(
  "/",
  validateClient,
  TournamentController.getAllTournaments
);

tournamentRouter.post(
  "/",
  validateClient,
  TournamentController.createTournament
);

//TEAMS
//REFACTOR TEAMS ENDPOINTS
// tournamentRouter.post(
//   "/teams/",
//   validateClient,
//   TeamController.createTeam
// )

// tournamentRouter.get(
//   "/teams/",
//   validateClient,
//   TeamController.getAllTeams
// )


// tournamentRouter.get(
//   "/teams/:id",
//   validateClient,
//   TeamController.getOneTeam,
// )

// TOURNAMENT SCHOOLS
// Register a school in a tournament
tournamentRouter.post(
  "/:tournamentId/schools",
  validateClient,
  // TeamController.createTeam
  SchoolController.registerSchoolInTournament
)

// Get all schools in a tournament
tournamentRouter.get(
  "/:tournamentId/schools",
  validateClient,
  SchoolController.getSchoolsByTournament
)

//TOURNAMENT STUDENTS

tournamentRouter.get(
  "/:tournamentId/players",
  validateClient,
  UserController.getStudentsByTournament
)

//PHASES
// AVAILABLE PHASES
tournamentRouter.get(
  "/phases",
  validateClient,
  PhaseController.getPossiblePhases
)

tournamentRouter.post(
  "/:tournamentId/phases",
  validateClient,
  PhaseController.createPhase
)

tournamentRouter.get(
  "/:tournamentId/phases",
  validateClient,
  PhaseController.getAllPhases
)

//MATCHES
tournamentRouter.post(
  "/:tournamentId/phases/:phaseId/matches",
  validateClient,
  MatchController.createMatch
)

export default tournamentRouter;
