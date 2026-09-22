import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

const router: Router = Router();

// GET /api/v1/health
router.get("/health", getHealth);

export default router;
