import { UUID } from "crypto";
import addressDTO from "./addressDTO";

interface SchoolDTO {
    id?: UUID;
    name: string;
    address: addressDTO;
    sponsor?: string;
}
export default SchoolDTO;