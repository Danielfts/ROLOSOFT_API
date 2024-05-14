import { UUID } from "crypto";
import Phase from "../models/Phase";
import SoccerStages from "../models/SoccerStages";
import phaseDTO from "../dtos/phaseDTO";
import Tournament from "../models/Tournament";

class PhaseService {
  static async getTournamentPhases(tournamentId: string): Promise<phaseDTO[]> {
    const result : Phase[] = await Phase.findAll({
      where: {
        tournamentId: tournamentId
      }});

    const dtos: phaseDTO[] =  [];

    for (const phase of result){
      const tournament = await phase.getTournament({attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"]
      }});
      const dto: phaseDTO = {
        id: phase.id,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        tournament: tournament
      }
      dtos.push(dto);
    }

    return dtos;
  }
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


}

export default PhaseService;