import { Router } from "express";
import { authController } from "./auth.controller";

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export const authRoutes = router;
