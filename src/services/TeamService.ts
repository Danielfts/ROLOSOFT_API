import { StatusCodes } from "http-status-codes";
import teamDTO from "../dtos/teamDTO";
import ServerError from "../errors/ServerError";
import School from "../models/School";
import Team from "../models/Team";
import Tournament from "../models/Tournament";
import { UUID } from "crypto";
import ClientError from "../errors/ClientError";

class TeamService {
  public static mapTeam(team: Team): teamDTO {
    const dto: teamDTO = {
      name: team.name,
      sponsor: team.sponsor,
      school: team.School && {
        id: team.School.id,
        name: team.School.name,
      },
      tournament: team.Tournament && {
        id: team.Tournament.id,
        name: team.Tournament.name,
      },
    };
    return dto;
  }

  public static async getOneTeam(id: UUID): Promise<teamDTO> {
    const result: Team | null = await Team.findByPk(id, {
      include: [Tournament, School],
    });
    if (result == null) {
      throw new ClientError(StatusCodes.NOT_FOUND, "Team not found", {});
    }
    const resultDTO = TeamService.mapTeam(result);
    return resultDTO;
  }
  private static async validateTeam(teamDTO: teamDTO) {}

  public static async createTeam(teamDTO: teamDTO): Promise<teamDTO> {
    TeamService.validateTeam(teamDTO);
    const team: Team = await Team.create({
      name: teamDTO.name,
      sponsor: teamDTO.sponsor,
      schoolId: teamDTO.school.id!,
      tournamentId: teamDTO.tournament.id!,
    });
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
  }

  public static async getAllTeams(): Promise<teamDTO[]> {
    const teams: Team[] = await Team.findAll({ include: [School, Tournament] });
    const teamDTOs: teamDTO[] = teams.map((item) => {
      const team: teamDTO = {
        id: item.id,
        name: item.name,
        sponsor: item.sponsor,
        school: {
          id: item.School.id,
          name: item.School.name,
        },
        tournament: {
          id: item.Tournament.id,
          name: item.Tournament.name,
          startDate: item.Tournament.startDate,
        },
      };
      return team;
    });

    return teamDTOs;
  }
}

export default TeamService;
