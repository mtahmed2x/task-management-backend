import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { taskRoutes } from "../modules/task/tast.route";

const router: Router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/task", route: taskRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
