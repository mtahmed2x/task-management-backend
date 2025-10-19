import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { loginSchema, registerSchema } from "./auth.dto";

const register = handleAsync(async (req: Request, res: Response) => {
  registerSchema.parse(req.body);
  const result = await authService.register(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = handleAsync(async (req: Request, res: Response) => {
  loginSchema.parse(req.body);
  const result = await authService.login(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const logout = handleAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.token as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged out successfully",
    data: {},
  });
});

const refresh = handleAsync(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body.token as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Refresh token fetched successfully",
    data: result,
  });
});

export const authController = {
  register,
  login,
  logout,
  refresh,
};
