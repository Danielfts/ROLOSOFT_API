import { UUID } from "crypto";
import teamDTO from "./teamDTO";

interface StudentDTO {
    id?: string;
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
}

export default StudentDTO;