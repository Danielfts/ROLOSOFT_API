import { StatusCodes } from "http-status-codes";
import { sequelize } from "../config/db";
import tournamentDTO from "../dtos/tournamentDTO";
import ClientError from "../errors/ClientError";
import Address from "../models/Address";
import Tournament from "../models/Tournament";
import AddressService from "./AddressService";

class TournamentService {
  public static validateTournament(
    tournament: tournamentDTO
  ): [boolean, object] {
    const errors: any = {};
    let isValid = true;
    if (!tournament.name) {
      errors["name"] = "Name is required";
      isValid = false;
    }
    if (!tournament.startDate) {
      errors["startDate"] = "Start Date is required";
      isValid = false;
    }
    if (!tournament.endDate) {
      errors["endDate"] = "End Date is required";
      isValid = false;
    }
    if (!tournament.address) {
      errors["address"] = "Address is required";
      isValid = false;
    }
    return [isValid, errors];
  }

  public static async createTournament(
    tournament: tournamentDTO
  ): Promise<tournamentDTO> {
    const [valid, errors] = TournamentService.validateTournament(tournament);
    if (!valid) {
      throw new ClientError(
        StatusCodes.BAD_REQUEST,
        "Validation Error",
        errors
      );
    }
    const result: Tournament = await sequelize.transaction<Tournament>(
      async (t) => {
        const address = await AddressService.createAddress(
          tournament.address!,
          t
        );
        const createdTournament = await Tournament.create(
          {
            name: tournament.name,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
            addressId: address.id,
          },
          { transaction: t }
        );

        const result = await Tournament.findByPk(createdTournament.id, {
          include: [Address],
          transaction: t,
        });

        return result!;
      }
    );

    const resultDTO: tournamentDTO = {
      id: result.id,
      name: result.name,
      startDate: result.startDate,
      endDate: result.endDate,
      address: {
        id: result.Address.id,
        address1: result.Address.address1,
        address2: result.Address.address2,
        city: result.Address.city,
        state: result.Address.state,
        postalCode: result.Address.postalCode,
        country: result.Address.country,
      },
    };
    return resultDTO;
  }

  public static async getTournamentById(
    id: string
  ): Promise<tournamentDTO | null> {
    const result: Tournament | null = await Tournament.findByPk(id, {
      include: [Address],
    });
    if (result) {
      const resultDTO: tournamentDTO = {
        id: result.id,
        name: result.name,
        startDate: result.startDate,
        endDate: result.endDate,
        address: result.Address,
      };
      return resultDTO;
    }
    return null;
  }

  public static async getAllTournaments(): Promise<tournamentDTO[]> {
    const result: Tournament[] = await Tournament.findAll({
      include: [Address],
    });
    const resultDTO: tournamentDTO[] = result.map((tournament) => {
      return {
        id: tournament.id,
        name: tournament.name,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        address: {
          id: tournament.Address.id,
          address1: tournament.Address.address1,
          address2: tournament.Address.address2,
          city: tournament.Address.city,
          state: tournament.Address.state,
          postalCode: tournament.Address.postalCode,
          country: tournament.Address.country,
        },
      };
    });
    return resultDTO;
  }

  public static async deleteTournament(id: string) {
    return await Tournament.destroy({
      where: {
        id: id,
      },
    });
  }
}

export default TournamentService;
