import ClientError from "../errors/clientError";
import ServerError from "../errors/serverError";

const inDevMode = process.env.NODE_ENV === "development";

interface errJson {
    success: boolean;
    message: string;
    data: any;
    
}
// TODO : USE INTERFACE FOR ERR
function globalErrorHandler(err: any, req: any, res: any, next: any) {
  const httpStatusCode = err.httpStatusCode || 500;
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
    succes: false,
    message: "Internal server error",
    data: err
  });
}

export default globalErrorHandler;
