import Gender from "../models/Gender";

class GenderService {
    public static async setupGenders(): Promise<void> {
        Gender.create({ name: "MALE" });
        Gender.create({ name: "FEMALE"});
        Gender.create({ name: "OTHER"});

    }
}

export default GenderService;