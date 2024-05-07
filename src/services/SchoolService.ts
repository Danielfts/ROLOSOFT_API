import { UUID } from "crypto";
import School from "../models/School";
import SchoolDTO from "../dtos/schoolDTO";
import { sequelize } from "../config/db";
import AddressService from "./AddressService";
import Address from "../models/Address";

class SchoolService {
    public static async createSchool(school: SchoolDTO): Promise<SchoolDTO> {
        return await sequelize.transaction<SchoolDTO>(async (t) => {
            const address = await AddressService.createAddress(school.address, t);
            const newSchool = await School.create({ name: school.name, addressId: address.id }, { transaction: t });
            const newSchoolAddress: Address = await newSchool.getAddress({ transaction: t, attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            }});
            const newSchoolDTO = { id: newSchool.id, name: newSchool.name, address:  newSchoolAddress};    

            return newSchoolDTO;
        });
    }
    
    public static async getSchools(): Promise<SchoolDTO[]> {
        const schools = await School.findAll({ include: Address});
        const schoolsDTO: SchoolDTO[] = [];
        for (const school of schools) {
            schoolsDTO.push({ id: school.id, name: school.name, address: {
                id: school.Address.id,
                address1: school.Address.address1,
                address2: school.Address.address2,
                city: school.Address.city,
                state: school.Address.state,
                country: school.Address.country,
                postalCode: school.Address.postalCode,
            } });
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
}

export default SchoolService;