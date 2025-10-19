import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/appError";
import { verifyAccessToken } from "../utils/jwtUtils";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const auth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, "No token provided"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, "No token provided"));
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded?.userId) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid token"));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, "User not found"));
    }

    req.user = user;

    next();
  } catch (err) {
    return next(
      new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token")
    );
  }
};
