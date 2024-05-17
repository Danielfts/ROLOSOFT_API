import { UUID } from "crypto";
import School from "../models/School";
import SchoolDTO from "../dtos/schoolDTO";
import { sequelize } from "../config/db";
import AddressService from "./AddressService";
import Address from "../models/Address";
import { Op, Sequelize, Transaction, where } from "sequelize";
import Team from "../models/Team";

class SchoolService {
  public static async createSchool(school: SchoolDTO): Promise<SchoolDTO> {
    return await sequelize.transaction<SchoolDTO>(async (t) => {
      const address = await AddressService.createAddress(school.address, t);
      const newSchool = await School.create(
        { name: school.name, addressId: address.id },
        { transaction: t }
      );
      const newSchoolAddress: Address = await newSchool.getAddress({
        transaction: t,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });
      const newSchoolDTO = {
        id: newSchool.id,
        name: newSchool.name,
        address: newSchoolAddress,
      };

      return newSchoolDTO;
    });
  }

  public static async registerSchoolInTournament(
    tournamentId: UUID,
    schoolId: UUID,
    sponsor: string,
    studentIds: UUID[]
  ) {
    let dto: SchoolDTO;
    dto = await sequelize.transaction(async (t) => {
      const team: Team = await Team.create({
        tournamentId: tournamentId,
        schoolId: schoolId,
        sponsor: sponsor,
      }, {transaction: t});
      const createdTeam: Team | null = await Team.findByPk(team.id, {
        include: School,
        transaction: t,
      });
      
      createdTeam?.addStudents(studentIds, { transaction: t })

      const school = createdTeam!.School;
      school.Address = await school.getAddress();
      const dto: SchoolDTO = this.mapSchool(school);
      dto.sponsor = createdTeam!.sponsor;
      return dto;
    });
    return dto;
  }

  public static async getSchoolsNotInTournament(
    tournamentId: string
  ): Promise<SchoolDTO[]> {
    const teams: Team[] = await Team.findAll({
      include: School,
      where: { tournamentId: tournamentId },
    });
    const occupiedSchoolIds: UUID[] = teams.map((team) => team.schoolId);
    const schools = await School.findAll({
      where: { id: { [Op.notIn]: occupiedSchoolIds } },
      include: Address,
    });
    const schoolsDTO: SchoolDTO[] = schools.map((school) =>
      this.mapSchool(school)
    );
    return schoolsDTO;
  }

  public static async getSchoolsByTournament(
    tournamentId: string
  ): Promise<SchoolDTO[]> {
    const schools: School[] = await School.findAll({
      where: {
        "$Team.tournamentId$": tournamentId,
      },
      include: [{ model: Team, as: "Team" }, { model: Address }],
    });
    const schoolsDTO: SchoolDTO[] = schools.map((school) => {
      const dto = this.mapSchool(school);
      dto.sponsor = school.Team!.sponsor;
      return dto;
    });
    return schoolsDTO;
  }

  public static async getSchools(): Promise<SchoolDTO[]> {
    const schools = await School.findAll({ include: Address });
    const schoolsDTO: SchoolDTO[] = [];
    for (const school of schools) {
      const dto = this.mapSchool(school);
      schoolsDTO.push(dto);
    }
    return schoolsDTO;
  }

  public static async retrieveSchool(id: string) {
    try {
      return await School.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  public static async updateSchool(id: string, name: string, addressId: UUID) {
    try {
      const school = await School.findByPk(id);
      if (school) {
        await school.update({ name, addressId });
        return school;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSchool(id: string) {
    try {
      const school = await School.findByPk(id);
      if (school) {
        await school.destroy();
        return school;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  private static mapSchool(school: School): SchoolDTO {
    const dto = {
      id: school.id,
      name: school.name,
      address: school.Address && {
        id: school.Address.id,
        address1: school.Address.address1,
        address2: school.Address.address2,
        city: school.Address.city,
        state: school.Address.state,
        country: school.Address.country,
        postalCode: school.Address.postalCode,
      },
    };
    return dto;
  }
}

export default SchoolService;
