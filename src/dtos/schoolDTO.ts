import { UUID } from "crypto";
import addressDTO from "./addressDTO";

interface SchoolDTO {
  id?: UUID;
  number: number;
  name: string;
  address: addressDTO;
  sponsor?: string;
  students?: any
}
export default SchoolDTO;
