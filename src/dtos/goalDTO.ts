import { UUID } from "crypto";

interface GoalDTO {
  student: { id: UUID };
  school: { id: UUID };
  minute: number;
}

export default GoalDTO;
