import { UUID } from "crypto";

interface tournamentDTO {
    id?: UUID;
    name: string;
    startDate: Date;
    endDate: Date;
    address: string;
}

export default tournamentDTO;