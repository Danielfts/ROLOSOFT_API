import matchDTO from "../dtos/matchDTO";
import Match from "../models/Match";
import PhaseService from "./PhaseService";
import TeamService from "./TeamService";

class MatchService {
  private static async validateMatch(matchDTO : matchDTO): Promise<boolean>{
    const teamA = await TeamService.getOneTeam(matchDTO.teamA.id!);
    const teamB = await TeamService.getOneTeam(matchDTO.teamB.id!);
    const startDate = new Date(matchDTO.startDate);
    const endDate = new Date(matchDTO.endDate);
    if (!startDate) {
      throw new Error("Start date is required");
    }
    if (!endDate) {
      throw new Error("End date is required");
    }
    if (teamA.id === teamB.id){
      throw new Error("Team A and Team B must be different teams");
    }
    if (teamA.tournament.id !== teamB.tournament.id){
      throw new Error("Teams must belong to the same tournament");
    }
    if (matchDTO.startDate >= matchDTO.endDate){
      throw new Error("Start date must be before end date");
    }
    if (teamA.school.id === teamB.school.id){
      throw new Error("Teams must belong to different schools");
    }

    return true;

  }

  public static async createMatch(match : matchDTO) : Promise<matchDTO> {
    await MatchService.validateMatch(match);
    const startDate = new Date(match.startDate);
    const endDate = new Date(match.endDate);
    const newMatch : Match = await Match.create({
      teamAId: match.teamA.id!,
      teamBId: match.teamB.id!,
      startDate: startDate,
      endDate: endDate,
      phaseId: match.phase.id!,
    });

    const teamA = await TeamService.getOneTeam(newMatch.teamAId);
    const teamB = await TeamService.getOneTeam(newMatch.teamBId);
    const phase = await PhaseService.getOnePhase(newMatch.phaseId);

    const newDTO : matchDTO = {
      id: newMatch.id!,
      teamA: teamA,
      teamB: teamB,
      startDate: newMatch.startDate!,
      endDate: newMatch.endDate!,
      phase: phase,
    }
    return newDTO;
  }
}

export default MatchService;
