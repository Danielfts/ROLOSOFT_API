import { UUID } from "crypto";

export interface goal {
  id: UUID | string,
  name: string,
  lastName: string,
  minute: number,
  playerNumber: number
  photoFileName?: string
}

export interface team {
  id: UUID | string,
  name: string,
  points: number,
  shieldFileName: any,
  goals: goal[]
}

interface MatchDetailDTO {
  id: UUID | string,
  dateTimeStart: Date,
  dateTimeEnd: Date,
  isPlaying: true,
  teamA: team

  teamB: team
}

export default MatchDetailDTO;