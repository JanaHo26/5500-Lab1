import { Router } from "express";
import {
  getResources,
  postReservation,
  getUserReservations,
} from "../controllers/reservation.controller";

const router: Router = Router();

router.get("/resources", getResources);
router.post("/reservations", postReservation);
router.get("/reservations/user/:userId", getUserReservations);

export default router;
