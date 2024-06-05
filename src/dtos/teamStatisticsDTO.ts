import { UUID } from "crypto";

interface teamStatisticsDTO {
  position: number;
  schoolId: UUID;
  schoolName: string;
  tournamentId: UUID;
  defeats: number;
  draws: number;
  victories: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  gamesPlayed: number;
  points: number;
  shieldFileName: string;
}

export default teamStatisticsDTO;
