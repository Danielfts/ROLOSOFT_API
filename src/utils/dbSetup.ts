import Address from "../models/Address";
import Admin from "../models/Admin";
import Gender from "../models/Gender";
import Parent from "../models/Parent";
import Student from "../models/Student";
import User from "../models/User";
import GenderService from "../services/GenderService";

export async function setupDatabase() {
    await GenderService.setupGenders();
}
