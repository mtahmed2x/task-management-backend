import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { StatusCodes } from "http-status-codes";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(
    new AppError(StatusCodes.NOT_FOUND, `🔍 Not Found - ${req.originalUrl}`)
  );
};
