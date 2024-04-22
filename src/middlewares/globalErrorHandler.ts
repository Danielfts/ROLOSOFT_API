import { NextFunction, Request, Response } from "express";
import ClientError from "../errors/ClientError";
import ServerError from "../errors/ServerError";

const inDevMode = process.env.NODE_ENV === "development";

interface errJson {
    success: boolean;
    message: string;
    data: any;
    
}
// TODO : USE INTERFACE FOR ERR
function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const httpStatusCode = err.httpStatusCode || 500;
  if (inDevMode) {
    console.error(err);
  }
  if (err instanceof ClientError) {
    return res.status(httpStatusCode).json({
      success: false,
      message: err.message,
      data: err.data,
    });
  }

  if (err instanceof ServerError) {
    return res.status(httpStatusCode).json({
      success: false,
      message: err.message,
      data: err.data,
    });
  }
  return res.status(httpStatusCode).json({
    success: false,
    message: "Internal server error",
    data: err
  });
}

export default globalErrorHandler;
