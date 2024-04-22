import { NextFunction, Request, Response } from "express";
import ClientError from "../errors/ClientError";
import ServerError from "../errors/ServerError";
import JSONResponse from "../dtos/JSONResponse";

const inDevMode = process.env.NODE_ENV === "development";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const httpStatusCode = err.httpStatusCode || 500;
  if (inDevMode) {
    console.error(err);
  }
  if (err instanceof ClientError) {
    const response: JSONResponse = {
      success: false,
      message: err.message,
      data: err.data,
    };

    return res.status(httpStatusCode).json(response);
  } else if (err instanceof ServerError) {
    const response: JSONResponse = {
      success: false,
      message: err.message,
      data: err.data,
    };
    return res.status(httpStatusCode).json(response);
  } else {
    const response: JSONResponse = {
      success: false,
      message: "Internal server error",
      data: err,
    };
    return res.status(httpStatusCode).json(response);
  }
}

export default globalErrorHandler;
