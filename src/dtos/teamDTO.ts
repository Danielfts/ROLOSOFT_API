import { UUID } from "crypto";
import SchoolDTO from "./schoolDTO";
import tournamentDTO from "./tournamentDTO";

interface teamDTO {
    id?: UUID
    sponsor: string,
    school: {
        id: UUID,
    } | SchoolDTO,
    tournament: {
        id: UUID
    } | tournamentDTO
}

export default teamDTO;