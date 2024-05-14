import { UUID } from "crypto";
import tournamentDTO from "./tournamentDTO";

export default interface phaseDTO {
  id?: UUID,
  tournament: tournamentDTO | {
    id: UUID
  },
  name: string,
  startDate: Date,
  endDate: Date,
}