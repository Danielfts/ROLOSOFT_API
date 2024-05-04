import SchoolService from "../services/SchoolService";
import { Request, Response, NextFunction } from "express";
import JSONResponse from "../dtos/JSONResponse";
import SchoolDTO from "../dtos/schoolDTO";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/UserService";
import Roles from "../models/Roles";

class SchoolController {
    public static async createSchool(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.validateUser(req.body.me.userId, Roles.admin);
            const school: SchoolDTO = await SchoolService.createSchool(req.body);
            const response:JSONResponse= {success: true, message: "School created successfully", data: school};
            res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }    

    public static async getSchools(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.validateUser(req.body.me.userId);
            const schools: SchoolDTO[] = await SchoolService.getSchools();
            const response: JSONResponse = {success: true, message: "Schools retrieved successfully", data: schools};
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default SchoolController;