import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";
import TeamController from "../controllers/TeamController";
import PhaseController from "../controllers/PhaseController";
import MatchController from "../controllers/MatchController";
import SchoolController from "../controllers/SchoolController";
import UserController from "../controllers/UserController";
import Match from "../models/Match";

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
// GET AVAILABLE PHASES
tournamentRouter.get(
  "/:tournamentId/phases",
  validateClient,
  PhaseController.getAllPhasesByTournament
)

//MATCHES
// CREATE
tournamentRouter.post(
  "/:tournamentId/phases/:phaseId/matches",
  validateClient,
  MatchController.createMatch
)

// GET ALL
tournamentRouter.get(
  "/:tournamentId",
  validateClient,
  MatchController.getAllMatches
)


export default tournamentRouter;
