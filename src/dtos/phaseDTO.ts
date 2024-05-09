import { UUID } from "crypto";
import tournamentDTO from "./tournamentDTO";

export default interface phaseDTO {
  id?: UUID,
  tournament: tournamentDTO,
  name: string,
  startDate: Date,
  endDate: Date,
}