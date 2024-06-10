import { UUID } from "crypto";
import teamDTO from "./teamDTO";

interface GreenCardDTO {
    id: UUID;
    reason: string;
}

interface StudentDTO {
    id?: string;
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
    team?: any;
    photoFileName?: string;
    greenCards?: GreenCardDTO[];
}

export default StudentDTO;