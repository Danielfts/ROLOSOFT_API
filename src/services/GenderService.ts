import Gender from "../models/Gender";

class GenderService {
    public static async setupGenders(): Promise<void> {
        
        Gender.findOrCreate({where: { name: "MALE" }});
        Gender.findOrCreate({where: { name: "FEMALE"}});
        Gender.findOrCreate({where: { name: "OTHER"}});

    }
}

export default GenderService;