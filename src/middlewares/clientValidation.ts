import { NextFunction, Request, Response } from "express";
import ClientError from "../errors/ClientError";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import ServerError from "../errors/ServerError";

export function validateClient(req: Request, res: Response, next: NextFunction){
    try {
        const auth = req.headers.authorization;
        const token: string = auth? auth.split(' ')[0] : "";
        const secret: string | undefined = process.env.JWT_SECRET;
        if (secret === undefined) {
            throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR,"Secret is required");
        }
        if (token === "") {
            throw new ClientError(StatusCodes.UNAUTHORIZED,"Token is required");
        };
        const decodedToken:any = jwt.verify(token, secret);
        req.body.me = decodedToken;
        next();

    } catch (error:any) {
        next(error);
    }
}