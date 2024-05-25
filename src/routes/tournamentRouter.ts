import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";
import PhaseController from "../controllers/PhaseController";
import MatchController from "../controllers/MatchController";
import SchoolController from "../controllers/SchoolController";
import UserController from "../controllers/UserController";
import { StatusCodes } from "http-status-codes";
import JSONResponse from "../dtos/JSONResponse";
import { v4 as uuidv4 } from 'uuid';

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

//TOURNAMENT STUDENTS

tournamentRouter.get(
  "/:tournamentId/players",
  validateClient,
  UserController.getStudentsByTournament
);

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
  (req, res, next) => {
    const dummy = [
      {
        id: uuidv4(),
        dateStart: new Date(),
        dateEnd: new Date(),
        isPlaying: true,
        teamA: {
          id: uuidv4(),
          name: "santa fe",
          points: 20,
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "gomelin",
              minute: 90,
              player_number: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "ñero",
              minute: 80,
              player_number: 11,
            },
          ],
        },
        teamB: {
          id: uuidv4(),
          points: 18,
          name: "junior",
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "caremonda",
              minute: 90,
              player_number: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "caremonda",
              minute: 80,
              player_number: 11,
            },
          ],
        },
      },
      {
        id: uuidv4(),
        dateStart: new Date(),
        dateEnd: new Date(),
        isPlaying: true,
        teamA: {
          id: uuidv4(),
          name: "santa fe",
          points: 20,
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "gomelin",
              minute: 90,
              player_number: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "ñero",
              minute: 80,
              player_number: 11,
            },
          ],
        },
        teamB: {
          id: uuidv4(),
          points: 18,
          name: "junior",
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "caremonda",
              minute: 90,
              player_number: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "caremonda",
              minute: 80,
              player_number: 11,
            },
          ],
        },
      },
    ];
    const response: JSONResponse = {
      success: true,
      message: "Matches retrieved successfully",
      data: dummy,
    };
    res.status(StatusCodes.OK).json(response);
  }
);

//ADD GOAL
tournamentRouter.post(
  "/:tournamentId/matches/:matchId",
  validateClient,
  MatchController.addGoal

)

export default tournamentRouter;
