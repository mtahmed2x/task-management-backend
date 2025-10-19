import { Router } from "express";
import { taskController } from "./task.controller";
import { auth } from "../../middlewares/auth";

const router: Router = Router();

router.post("/create", auth, taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTask);
router.patch("/update/:id", auth, taskController.updateTask);
router.delete("/delete/:id", auth, taskController.deleteTask);

export const taskRoutes = router;
