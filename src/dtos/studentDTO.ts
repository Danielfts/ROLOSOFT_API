import { UUID } from "crypto";
import teamDTO from "./teamDTO";

interface StudentDTO {
    id?: string;
    school: string;
    fieldPosition: string;
    shirtNumber: number;
    team: teamDTO | {id: UUID};
    IMSS: string;
}

export default StudentDTO;