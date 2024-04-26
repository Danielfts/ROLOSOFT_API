import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";

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

export default tournamentRouter;
