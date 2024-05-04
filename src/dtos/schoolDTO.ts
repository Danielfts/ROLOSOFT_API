import { UUID } from "crypto";
import addressDTO from "./addressDTO";

interface SchoolDTO {
    id?: UUID;
    name: string;
    address: addressDTO;
}
export default SchoolDTO;