import { UUID } from "crypto";
import Match from "../models/Match";
import Team from "../models/Team";
import Phase from "../models/Phase";
import School from "../models/School";
import Tournament from "../models/Tournament";
import ServerError from "../errors/ServerError";
import { StatusCodes } from "http-status-codes";
import GeneralTable from "../models/GeneralTable";

class GeneralTableService {
  public static async updateGeneralTable(tournamentId: UUID): Promise<void> {
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
    let i = 0;
    for (let s of tournamentSchools) {
      await GeneralTable.findOrCreate({
        where: {
          teamId: s.Team.id,
        },
        defaults: {
          defeats: 0,
          draws: 0,
          victories: 0,
          teamId: s.Team.id,
          position: i + 1,
        },
      });
      i++;
    }

    const tournamentMatches: Match[] = await Match.findAll({
      include: [
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

    return;
  }

  public static async getGeneralTable(tournamentId: UUID): Promise<object[]> {
    await this.updateGeneralTable(tournamentId);

    const generalTable: GeneralTable[] = await GeneralTable.findAll({
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

    const generalTableObject: object[] = generalTable.map((gt) => {
      return {
        team: gt.Team.School.name,
        victories: gt.victories,
        draws: gt.draws,
        defeats: gt.defeats,
        position: gt.position,
        //TODO REMOVE DUMMY DATA
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Escudo_de_Independiente_Santa_Fe.png/150px-Escudo_de_Independiente_Santa_Fe.png",
      };
    });

    return generalTableObject;
  }
}

export default GeneralTableService;
