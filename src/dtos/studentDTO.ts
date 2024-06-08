import { UUID } from "crypto";
import teamDTO from "./teamDTO";

interface StudentDTO {
    id?: string;
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
    team?: any;
    photoFileName?: string;
}

export default StudentDTO;