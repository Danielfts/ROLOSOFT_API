import matchDTO from "../dtos/matchDTO";
import Phase from "../models/Phase";
import Roles from "../models/Roles";

import GenderService from "../services/GenderService";
import MatchService from "../services/MatchService";
import SchoolService from "../services/SchoolService";
import TournamentService from "../services/TournamentService";
import UserService from "../services/UserService";
import { setupDummy } from "./dummySetup";

export async function setupDatabase(): Promise<void> {
  const mode = process.env.NODE_ENV;
  await GenderService.setupGenders();

  if (mode === "development" || true) {
    await setupDummy();
  }

}
