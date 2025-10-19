import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { PrismaClient, Task } from "../../generated/prisma";
const prisma = new PrismaClient();

const createTask = async (payload: {
  userId: string;
  title: string;
  body: string;
}): Promise<Task> => {
  const { userId, title, body } = payload;
  const task = await prisma.task.create({
    data: { title, body, createdById: userId, lastEditedById: userId },
  });
  return task;
};

const getAllTask = async () => {
  return await prisma.task.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      lastEditedBy: { select: { id: true, name: true } },
      lockedBy: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
};

const getTask = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      lastEditedBy: { select: { id: true, name: true } },
      lockedBy: { select: { id: true, name: true } },
    },
  });
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, "Task not found");
  return task;
};

const updateTask = async (
  userId: string,
  taskId: string,
  payload: Partial<Pick<Task, "title" | "body">>
) => {
  const { title, body } = payload;
  if (!title && !body)
    throw new AppError(StatusCodes.BAD_REQUEST, "Noting to update");
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, "Task not found");

  if (task.lockedById && task.lockedById !== userId) {
    throw new AppError(StatusCodes.LOCKED, "Task locked by another user");
  }

  const data: Partial<{ title: string; body: string; lastEditedById: string }> =
    {
      lastEditedById: userId,
    };
  if (title !== undefined) data.title = title;
  if (body !== undefined) data.body = body;

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  return updatedTask;
};

const deleteTask = async (id: string) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, "Task not found");
  return await prisma.task.delete({ where: { id } });
};

const lockTask = async (taskId: string, userId: string): Promise<Task> => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, "Task not found");

  if (task.lockedById && task.lockedById !== userId) {
    throw new AppError(
      StatusCodes.LOCKED,
      "Task already locked by another user"
    );
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: { lockedById: userId, lockedAt: new Date() },
  });
};

const unlockTask = async (taskId: string, userId: string): Promise<Task> => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, "Task not found");

  if (task.lockedById !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Cannot unlock task locked by another user"
    );
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: { lockedById: null, lockedAt: null },
  });
};

export const taskService = {
  createTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
  lockTask,
  unlockTask,
};
