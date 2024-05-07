import { StatusCodes } from "http-status-codes";
import teamDTO from "../dtos/teamDTO";
import ServerError from "../errors/ServerError";
import School from "../models/School";
import Team from "../models/Team";
import Tournament from "../models/Tournament";

class TeamService {
  private static async validateTeam(teamDTO: teamDTO) {}

  public static async createTeam(teamDTO: teamDTO): Promise<teamDTO> {
    TeamService.validateTeam(teamDTO);
    const team: Team = await Team.create({
      name: teamDTO.name,
      sponsor: teamDTO.sponsor,
      schoolId: teamDTO.school.id!,
      tournamentId: teamDTO.tournament.id!,
    });
    if (team !== null) {
      const result: teamDTO = {
        id: team!.id,
        name: team!.name,
        sponsor: team!.sponsor,
        school: await team!.getSchool({
          attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
        }),
        tournament: await team!.getTournament({
          attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
        }),
      };
      return result;
    } else {
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error retrieving team",
        {}
      );
    }
  }
}

export default TeamService;
