import { Router } from "express";
import TournamentController from "../controllers/TournamentController";
import { validateClient } from "../middlewares/clientValidation";

const tornamentRouter = Router();



export default tornamentRouter;