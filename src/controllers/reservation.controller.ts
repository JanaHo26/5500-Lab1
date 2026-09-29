import { Request, Response, NextFunction } from "express";
import {
  listResources,
  createReservation,
  getActiveReservationsForUser,
  ValidationError,
  ConflictError,
} from "../services/reservation.service";
import { Resource, Reservation, ErrorResponse } from "../types/reservation";

// GET /api/v1/resources
export function getResources(
  req: Request,
  res: Response<Resource[] | ErrorResponse>,
  next: NextFunction
): void {
  try {
    const type = req.query.type as string | undefined;
    const result = listResources(type);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ code: error.code, message: error.message });
      return;
    }
    next(error);
  }
}

// POST /api/v1/reservations
export function postReservation(
  req: Request,
  res: Response<Reservation | ErrorResponse>,
  next: NextFunction
): void {
  try {
    const reservation = createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(409).json({ code: error.code, message: error.message });
      return;
    }
    if (error instanceof ValidationError) {
      res.status(400).json({ code: error.code, message: error.message });
      return;
    }
    next(error);
  }
}

// GET /api/v1/reservations/user/:userId
export function getUserReservations(
  req: Request,
  res: Response<Reservation[] | ErrorResponse>,
  next: NextFunction
): void {
  try {
    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    const result = getActiveReservationsForUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
