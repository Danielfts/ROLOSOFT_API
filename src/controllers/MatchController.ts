import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import Roles from "../models/Roles";
import JSONResponse from "../dtos/JSONResponse";
import MatchService from "../services/MatchService";
import { StatusCodes } from "http-status-codes";
import GoalDTO from "../dtos/goalDTO";
import { v4 as uuidv4 } from 'uuid';
import MatchDetailDTO from "../dtos/matchDetailDTO";

class MatchController {
  public static async addGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.me.userId;
      const tournamentId: any = req.params.tournamentId;
      const matchId: any = req.params.matchId;
      await UserService.validateUser(userId, Roles.admin);
      const goalDTO: GoalDTO = req.body;

      const result = await MatchService.addGoal(goalDTO, tournamentId, matchId);
      const response: JSONResponse = {
        success: true,
        message: "Goal created successfully",
        data: result,
      };

      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
  public static async getAllMatchesByTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId);
      const tournamentId: any = req.params.tournamentId;
      const data: any[] = await MatchService.getAllMatchesByTournament(
        tournamentId
      );

      const response: JSONResponse = {
        success: true,
        message: `Matches for tournament ${tournamentId} retrieved successfully`,
        data: data,
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static getDummyMatchesByTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    const dummy: MatchDetailDTO[] = [
      {
        id: uuidv4(),
        dateTimeStart: new Date(),
        dateTimeEnd: new Date(),
        isPlaying: true,
        teamA: {
          id: uuidv4(),
          name: "santa fe",
          points: 20,
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "gomelin",
              minute: 90,
              playerNumber: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "ñero",
              minute: 80,
              playerNumber: 11,
            },
          ],
        },
        teamB: {
          id: uuidv4(),
          points: 18,
          name: "junior",
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "caremonda",
              minute: 90,
              playerNumber: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "caremonda",
              minute: 80,
              playerNumber: 11,
            },
          ],
        },
      },
      {
        id: uuidv4(),
        dateTimeStart: new Date(),
        dateTimeEnd: new Date(),
        isPlaying: true,
        teamA: {
          id: uuidv4(),
          name: "santa fe",
          points: 20,
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "gomelin",
              minute: 90,
              playerNumber: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "ñero",
              minute: 80,
              playerNumber: 11,
            },
          ],
        },
        teamB: {
          id: uuidv4(),
          points: 18,
          name: "junior",
          shieldImg: "null",
          goals: [
            {
              id: uuidv4(),
              name: "pepito",
              lastName: "caremonda",
              minute: 90,
              playerNumber: 10,
            },
            {
              id: uuidv4(),
              name: "juanito",
              lastName: "caremonda",
              minute: 80,
              playerNumber: 11,
            },
          ],
        },
      },
    ];
    const response: JSONResponse = {
      success: true,
      message: "Matches retrieved successfully",
      data: dummy,
    };
    res.status(StatusCodes.OK).json(response);
  }
  public static async createMatch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //VALIDATE
      const userId = req.body.me.userId;
      await UserService.validateUser(userId, Roles.admin);

      const matchDTO: any = req.body;
      const phaseName: any = req.params.phaseName;
      const tournamentId: any = req.params.tournamentId;

      const result = await MatchService.createMatch(
        matchDTO,
        tournamentId,
        phaseName
      );

      const response: JSONResponse = {
        success: true,
        message: "Match created",
        data: result,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default MatchController;
