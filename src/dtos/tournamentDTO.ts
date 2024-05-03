import { UUID } from "crypto";
import addressDTO from "./addressDTO";

interface tournamentDTO {
    id?: UUID;
    name: string;
    startDate: Date;
    endDate: Date;
    address: addressDTO;
}

export default tournamentDTO;