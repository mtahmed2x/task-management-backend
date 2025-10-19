import jwt from "jsonwebtoken";
import crypto from "crypto";
import { StringValue } from "ms";
import { config } from "../config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const signAccessToken = (payload: { userId: string }) =>
  jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as StringValue,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwt.accessSecret) as any;

const generateRandomToken = () => crypto.randomBytes(48).toString("hex");

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const days = parseInt(config.jwt.refreshExpiresIn.replace(/\D/g, ""));

export const createRefreshToken = async (userId: string) => {
  const token = generateRandomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const rt = await prisma.refreshToken.create({
    data: { tokenHash, userId, expiresAt },
  });

  return { tokenPlain: token, dbToken: rt };
};

export const rotateRefreshToken = async (
  oldPlainToken: string,
  userId: string
) => {
  const oldHash = hashToken(oldPlainToken);
  const existing = await prisma.refreshToken.findFirst({
    where: { tokenHash: oldHash },
  });

  if (
    !existing ||
    existing.revoked ||
    existing.userId !== userId ||
    existing.expiresAt < new Date()
  ) {
    throw new Error("Invalid refresh token");
  }

  const { tokenPlain, dbToken } = await (async () => {
    const token = generateRandomToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const newToken = await prisma.refreshToken.create({
      data: { tokenHash, userId, expiresAt },
    });
    return { tokenPlain: token, dbToken: newToken };
  })();

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revoked: true, replacedBy: dbToken.id },
  });

  return { tokenPlain, dbToken };
};

export const revokeRefreshToken = async (token: string) => {
  const hash = hashToken(token);
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hash },
    data: { revoked: true },
  });
};

export const verifyRefreshToken = async (token: string) => {
  const hash = hashToken(token);
  const found = await prisma.refreshToken.findFirst({
    where: { tokenHash: hash },
  });
  if (!found || found.revoked || found.expiresAt < new Date()) return null;
  return found;
};
