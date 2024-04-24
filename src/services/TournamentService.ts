import Tournament from "../models/Tournament";

class TournamentService {
    public static async createTournament(name: string, startDate: Date, endDate: Date, address: string) {
        return await Tournament.create({
            name,
            startDate,
            endDate,
            address
        });
    }

    public static async getTournamentById(id: string) {
        return await Tournament.findByPk(id);
    }

    public static async getAllTournaments() {
        return await Tournament.findAll();
    }

    public static async updateTournament(id: string, name: string, startDate: Date, endDate: Date, address: string) {
        return await Tournament.update({
            name,
            startDate,
            endDate,
            address
        }, {
            where: {
                id: id
            }
        });
    }

    public static async deleteTournament(id: string) {
        return await Tournament.destroy({
            where: {
                id: id
            }
        });
    }
}

export default TournamentService;