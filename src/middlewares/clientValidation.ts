import { NextFunction, Request, Response } from "express";
import ClientError from "../errors/ClientError";
import { StatusCodes } from "http-status-codes";

export function validateClient(req: Request, res: Response, next: NextFunction){
    try {
        const token: string = req.headers.authorization? req.headers.authorization.split(" ")[1] : "";
        if (token === "") {
            throw new ClientError(StatusCodes.UNAUTHORIZED,"Token is required");
        };
        
    } catch (error) {
        next(error);
    }
}