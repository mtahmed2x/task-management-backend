import bcrypt from "bcrypt";
import {
  signAccessToken,
  createRefreshToken,
  rotateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../../utils/jwtUtils";
import { PrismaClient } from "../../generated/prisma";
import { AppError } from "../../errors/appError";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const register = async (payload: {
  email: string;
  password: string;
  name: string;
}) => {
  const { email, password, name } = payload;
  if (!email || !password) throw new Error("email+password required");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(StatusCodes.CONFLICT, "User already exists");

  const pwHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: pwHash, name },
  });

  const accessToken = signAccessToken({ userId: user.id });
  const { tokenPlain: refreshToken } = await createRefreshToken(user.id);

  const safeUser = { ...user, password: undefined } as any;
  return { user: safeUser, accessToken, refreshToken };
};

const login = async (payload: {
  email: string;
  password: string;
  deviceToken?: string;
}) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const { tokenPlain: refreshToken } = await createRefreshToken(user.id);

  const safeUser = { ...user, password: undefined } as any;
  return { user: safeUser, accessToken, refreshToken };
};

const refresh = async (oldRefreshToken: string) => {
  const found = await verifyRefreshToken(oldRefreshToken);
  if (!found)
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");

  const { tokenPlain: newRefreshToken } = await rotateRefreshToken(
    oldRefreshToken,
    found.userId
  );

  const user = await prisma.user.findUnique({ where: { id: found.userId } });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const accessToken = signAccessToken({ userId: user.id });
  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: { ...user, password: undefined },
  };
};

const logout = async (refreshToken?: string) => {
  if (refreshToken) await revokeRefreshToken(refreshToken);
  return;
};

export const authService = {
  register,
  login,
  refresh,
  logout,
};
