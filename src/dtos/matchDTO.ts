import { UUID } from "crypto";
import phaseDTO from "./phaseDTO";
import teamDTO from "./teamDTO";

interface matchDTO {
  id?: UUID;
  startDate: Date;
  endDate: Date;
  teamA: {id: UUID;} | teamDTO; 
  teamB: {id: UUID;} | teamDTO; 
  phase: {id: UUID;} | phaseDTO; 
}

export default matchDTO;