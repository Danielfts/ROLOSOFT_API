import { UUID } from "crypto";
import Match from "../models/Match";
import Team from "../models/Team";
import Phase from "../models/Phase";
import School from "../models/School";
import Tournament from "../models/Tournament";
import ServerError from "../errors/ServerError";
import { StatusCodes } from "http-status-codes";
import GeneralTable from "../models/GeneralTable";
import Goal from "../models/Goal";

class GeneralTableService {
  public static async updateGeneralTable(tournamentId: UUID): Promise<void> {
    let processingMap: Map<
      UUID,
      {
        generalTableInstance: GeneralTable;
        school: School;
      }
    > = new Map<UUID, any>();

    const tournament: Tournament | null = await Tournament.findOne({
      where: {
        id: tournamentId,
      },
    });

    if (tournament === null) {
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Couldn't find tournament with id ${tournamentId}`
      );
    }

    const tournamentSchools: School[] = await School.findAll({
      include: [
        {
          model: Team,
          right: true,
          where: {
            tournamentId: tournamentId,
          },
        },
      ],
    });

    await GeneralTable.destroy({
      where: {
        teamId: tournamentSchools.map((s) => s.Team.id),
      },
    });

    let i = 0;
    for (let s of tournamentSchools) {
      const [instance, created] = await GeneralTable.findOrCreate({
        where: {
          teamId: s.Team.id,
        },
        defaults: {
          defeats: 0,
          draws: 0,
          victories: 0,
          teamId: s.Team.id,
          position: i + 1,
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          gamesPlayed: 0,
        },
      });

      processingMap.set(s.Team.id, {
        generalTableInstance: instance,
        school: s,
      });
      i++;
    }

    // const table : GeneralTable[] = await this.getTableByTournament(tournamentId);

    const tournamentMatches: Match[] = await Match.findAll({
      include: [
        {
          model: Goal,
          as: "Goals",
          include: [
            {
              model: Team,
              as: "ForTeam",
            },
          ],
        },
        {
          model: Phase,
          right: true,
          where: {
            tournamentId: tournamentId,
          },
        },
        {
          model: Team,
          as: "TeamA",
          include: [School],
        },
        {
          model: Team,
          as: "TeamB",
          include: [School],
        },
      ],
    });

    for (let m of tournamentMatches) {
      processingMap.get(m.TeamA.id)!.generalTableInstance.gamesPlayed++;
      processingMap.get(m.TeamB.id)!.generalTableInstance.gamesPlayed++;
      if (m.endDate > new Date()) {
        continue;
      }
      let marker = {
        teamA: 0,
        teamB: 0,
      };

      for (let g of m.Goals) {
        if (g.ForTeam.id === m.TeamA.id) {
          marker.teamA++;
        } else {
          marker.teamB++;
        }
      }

      processingMap.get(m.TeamA.id)!.generalTableInstance.goalsFor += marker.teamA;
      processingMap.get(m.TeamA.id)!.generalTableInstance.goalsAgainst += marker.teamB;

      processingMap.get(m.TeamB.id)!.generalTableInstance.goalsFor += marker.teamB;
      processingMap.get(m.TeamB.id)!.generalTableInstance.goalsAgainst += marker.teamA;

      if (marker.teamA > marker.teamB) {
        processingMap.get(m.TeamA.id)!.generalTableInstance.victories++;
        processingMap.get(m.TeamB.id)!.generalTableInstance.defeats++;

        processingMap.get(m.TeamA.id)!.generalTableInstance.points += 3;
      } else if (marker.teamA < marker.teamB) {
        processingMap.get(m.TeamB.id)!.generalTableInstance.victories++;
        processingMap.get(m.TeamA.id)!.generalTableInstance.defeats++;

        processingMap.get(m.TeamB.id)!.generalTableInstance.points += 3;
      } else {
        processingMap.get(m.TeamA.id)!.generalTableInstance.draws++;
        processingMap.get(m.TeamB.id)!.generalTableInstance.draws++;

        processingMap.get(m.TeamA.id)!.generalTableInstance.points++;
        processingMap.get(m.TeamB.id)!.generalTableInstance.points++;
      }

      processingMap.get(m.TeamA.id)!.generalTableInstance.goalDifference +=
        marker.teamA - marker.teamB;
      processingMap.get(m.TeamB.id)!.generalTableInstance.goalDifference +=
        marker.teamB - marker.teamA;
    }

    let generalTableArray: GeneralTable[] = [];
    for (let [_, value] of processingMap) {
      generalTableArray.push(value.generalTableInstance);
    }
    generalTableArray.sort((a, b) => {
      if (a.victories > b.victories) {
        return -1;
      } else if (a.victories < b.victories) {
        return 1;
      } else {
        if (a.draws > b.draws) {
          return -1;
        } else if (a.draws < b.draws) {
          return 1;
        } else {
          if (a.defeats < b.defeats) {
            return -1;
          } else if (a.defeats > b.defeats) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    });

    let position = 1;
    for (let gt of generalTableArray) {
      gt.position = position;
      await gt.save();
      position++;
    }
    return;
  }

  public static async getGeneralTable(tournamentId: UUID): Promise<object[]> {
    await this.updateGeneralTable(tournamentId);

    const generalTable: GeneralTable[] =
      await GeneralTableService.getTableByTournament(tournamentId);

    const generalTableObject: object[] = generalTable.map((gt) => {
      return {
        team: gt.Team.School.name,
        victories: gt.victories,
        draws: gt.draws,
        defeats: gt.defeats,
        position: gt.position,
        points: gt.points,
        goalsFor: gt.goalsFor,
        goalsAgainst: gt.goalsAgainst,
        goalDifference: gt.goalDifference,
        gamesPlayed: gt.gamesPlayed,

        //TODO REMOVE DUMMY DATA
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Escudo_de_Independiente_Santa_Fe.png/150px-Escudo_de_Independiente_Santa_Fe.png",
      };
    });

    return generalTableObject;
  }

  private static async getTableByTournament(
    tournamentId: string
  ): Promise<GeneralTable[]> {
    return await GeneralTable.findAll({
      order: [["position", "ASC"]],
      include: [
        {
          model: Team,
          include: [School],
          right: true,
          where: {
            tournamentId: tournamentId,
          },
        },
      ],
    });
  }

  public static async getGeneralTableByTeamId(teamId: UUID): Promise<GeneralTable> {
    const result = await GeneralTable.findOne({
      where: {
        teamId: teamId,
      },
    });
    if (result === null) {
      throw new ServerError(
        StatusCodes.NOT_FOUND,
        `Couldn't find a general table for team with id ${teamId}`
      );
    }
    return result;
  }
}

export default GeneralTableService;
