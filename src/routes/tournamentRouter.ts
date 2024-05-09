import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";
import TeamController from "../controllers/TeamController";
import PhaseController from "../controllers/PhaseController";

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
tournamentRouter.post(
  "/teams/",
  validateClient,
  TeamController.createTeam
)

tournamentRouter.get(
  "/teams/",
  validateClient,
  TeamController.getAllTeams
)


tournamentRouter.get(
  "/teams/:id",
  validateClient,
  TeamController.getOneTeam,
)

//PHASES
tournamentRouter.post(
  "/:tournamentId/phases",
  validateClient,
  PhaseController.createPhase
)

export default tournamentRouter;
