import { UUID } from "crypto";
import addressDTO from "./addressDTO";

interface SchoolDTO {
  id?: UUID;
  clave: string;
  name: string;
  address: addressDTO;
  sponsor?: string;
  students?: any
  shieldFileName?: string;
}
export default SchoolDTO;
