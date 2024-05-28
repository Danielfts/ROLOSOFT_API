import { UUID } from "crypto";

interface GoalTableRowDTO {
  studentId: UUID,
  position: number,
  playerPhotoUrl: string,
  teamPhotoUrl: string,
  firstName: string,
  lastName: string,
  teamName: string,
  points: number,
  goals: number,
  schoolId: UUID,
}

export default GoalTableRowDTO;