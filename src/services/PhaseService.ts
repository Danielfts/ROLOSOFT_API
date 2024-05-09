import { UUID } from "crypto";
import Phase from "../models/Phase";
import SoccerStages from "../models/SoccerStages";
import phaseDTO from "../dtos/phaseDTO";

class PhaseService {
  public static async createPhase(phase: phaseDTO) : Promise<phaseDTO>{
    const result: Phase | null = await Phase.create({
      tournamentId : phase.tournament.id!,
      name: phase.name,
      startDate: phase.startDate, 
      endDate: phase.endDate,
    })
    const tournament = await result.getTournament({attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"]
    }});
    const dto: phaseDTO = {
      id: result.id,
      name: result.name,
      startDate: result.startDate,
      endDate: result.endDate,
      tournament: tournament
    }

    return dto;
  }

  public static async getTournamentPhases(tournamentID: UUID){

  }

}

export default PhaseService;