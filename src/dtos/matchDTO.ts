import { UUID } from "crypto";
import phaseDTO from "./phaseDTO";
import teamDTO from "./teamDTO";

interface matchDTO {
  id?: UUID;
  startDateTime: Date;
  endDateTime: Date;
  schoolA : any 
  schoolB: any
  phase: {id: UUID;} | phaseDTO; 
}

export default matchDTO;