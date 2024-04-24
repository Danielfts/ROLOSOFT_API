import Gender from "../models/Gender";

class GenderService {
    public static async setupGenders(): Promise<void> {
        const genders = ["MALE", "FEMALE", "OTHER"];

        await Promise.all(genders.map(async (name) => {
            await Gender.findOrCreate({ where: { name } });
        }));
    }
}

export default GenderService;