import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";
import PhaseController from "../controllers/PhaseController";
import MatchController from "../controllers/MatchController";
import SchoolController from "../controllers/SchoolController";
import UserController from "../controllers/UserController";
import { StatusCodes } from "http-status-codes";
import JSONResponse from "../dtos/JSONResponse";


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
);

// GET ALL SCHOOLS IN A TOURNAMENT
tournamentRouter.get(
  "/:tournamentId/schools",
  validateClient,
  SchoolController.getSchoolsByTournament
);

//SET TEAM POINTS
tournamentRouter.post(
  "/:tournamentId/schools/:schoolId/points",
  validateClient,
  SchoolController.setTeamPoints
)

//TOURNAMENT STUDENTS

tournamentRouter.get(
  "/:tournamentId/players",
  validateClient,
  UserController.getStudentsByTournament
);

// TEAM STUDENTS
tournamentRouter.get(
  "/:tournamentId/schools/:schoolId/players",
  validateClient,
  UserController.getStudentsByTournamentAndSchool
)

//  Add student to school in tournament
tournamentRouter.post(
  "/:tournamentId/schools/:schoolId/students/:studentId",
  validateClient,
  UserController.addStudentToTeam
);

//PHASES
// GET AVAILABLE PHASES
tournamentRouter.get(
  "/:tournamentId/phases",
  validateClient,
  PhaseController.getAllPhasesByTournament
);

//MATCHES
// CREATE
tournamentRouter.post(
  "/:tournamentId/phases/:phaseName/matches",
  validateClient,
  MatchController.createMatch
);

// GET ALL
tournamentRouter.get(
  "/:tournamentId/matches",
  validateClient,
  MatchController.getAllMatchesByTournament
);

// GET BY TEAM
tournamentRouter.get(
  "/:tournamentId/schools/:schoolId/matches",
  validateClient,
  MatchController.getAllMatchesByTournamentAndSchool
)

//ADD GOAL
tournamentRouter.post(
  "/:tournamentId/matches/:matchId",
  validateClient,
  MatchController.addGoal

)

//SEARCH
tournamentRouter.get(
  "/:tournamentId/search",
  validateClient,
  TournamentController.searchStudentsAndSchools
)

//STATISTICS

tournamentRouter.get(
  "/:tournamentId/general-table",
  validateClient,
  TournamentController.getGeneralTable
)

tournamentRouter.get(
  "/:tournamentId/scoring-table",
  validateClient,
  TournamentController.getGoalTable
)



export default tournamentRouter;
