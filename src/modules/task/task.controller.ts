import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { taskService } from "./task.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createTask = handleAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await taskService.createTask({ ...req.body, userId });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getAllTasks = handleAsync(async (_req: Request, res: Response) => {
  const result = await taskService.getAllTask();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tasks fetched successfully",
    data: result,
  });
});

const getTask = handleAsync(async (req: Request, res: Response) => {
  const result = await taskService.getTask(req.params.id!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Task fetched successfully",
    data: result,
  });
});

const updateTask = handleAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await taskService.updateTask(userId, req.params.id!, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = handleAsync(async (req: Request, res: Response) => {
  const result = await taskService.deleteTask(req.params.id!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

// const lockTask = handleAsync(async (req: Request, res: Response) => {
//   const userId = req.user!.id;
//   const result = await taskService.lockTask(req.params.id, userId);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Task locked successfully",
//     data: result,
//   });
// });

// const unlockTask = handleAsync(async (req: Request, res: Response) => {
//   const userId = req.user!.id;
//   const result = await taskService.unlockTask(req.params.id, userId);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Task unlocked successfully",
//     data: result,
//   });
// });

export const taskController = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  //   lockTask,
  //   unlockTask,
};
