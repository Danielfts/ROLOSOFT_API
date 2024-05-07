import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";
import TeamController from "../controllers/TeamController";

const tournamentRouter = Router();

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

tournamentRouter.post(
  "/teams/",
  validateClient,
  TeamController.createTeam
)

export default tournamentRouter;
