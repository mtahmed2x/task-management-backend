import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { JwtPayload } from "jsonwebtoken";

import { verifyAccessToken } from "./utils/jwtUtils";
import { PrismaClient } from "./generated/prisma";

let io: Server;
const prisma = new PrismaClient();
const onlineUsers = new Map<string, string>();

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
      const decoded: JwtPayload = verifyAccessToken(token);
      if (!decoded?.userId) {
        return next(new Error("Authentication error: Invalid token"));
      }
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }
      socket.data.user = user;

      if (user?.id) {
        socket.join(user.id.toString());
      }
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;
    console.log(`⚡: User ${userId} connected with socket id ${socket.id}`);

    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("start_edit", async ({ taskId }) => {
      const userId = socket.data.user.id;
      const userName = socket.data.user.name;
      await prisma.task.update({
        where: { id: taskId },
        data: { lockedById: userId, lockedAt: new Date() },
      });
      io.emit("task_locked", { taskId, userId, userName });
    });

    socket.on("end_edit", async ({ taskId }) => {
      const userId = socket.data.user.id;
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (task?.lockedById === userId) {
        await prisma.task.update({
          where: { id: taskId },
          data: { lockedById: null, lockedAt: null },
        });
      }
      io.emit("task_unlocked", { taskId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log(
        `🔥: User ${userId} disconnected. Online users: ${onlineUsers.size}`
      );
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

export function getOnlineUsers() {
  return onlineUsers;
}
