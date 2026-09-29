import { randomUUID } from "crypto";
import {
  Resource,
  ResourceType,
  Reservation,
  ReservationInput,
} from "../types/reservation";

// just arrays in memory, resets every time server restarts
const resources: Resource[] = [
  {
    id: "res-101",
    name: "Study Room 302",
    type: "ROOM",
    location: "Building A, Floor 3",
    isAvailable: true,
  },
  {
    id: "res-102",
    name: "3D Printer A",
    type: "EQUIPMENT",
    location: "Maker Lab, Floor 1",
    isAvailable: true,
  },
  {
    id: "res-103",
    name: "Chemistry Lab B",
    type: "LAB",
    location: "Science Building, Floor 2",
    isAvailable: true,
  },
];

const reservations: Reservation[] = [];

const validTypes: ResourceType[] = ["ROOM", "EQUIPMENT", "LAB"];

// custom error types so the controller knows what status code to send back
export class ValidationError extends Error {
  code = "VALIDATION_ERROR";
}

export class ConflictError extends Error {
  code = "DOUBLE_BOOKING";
}

export function listResources(type?: string): Resource[] {
  // if no type given just return everything
  if (type === undefined) {
    return resources;
  }

  if (type.trim() === "") {
    throw new ValidationError("type must be a non-empty string when provided.");
  }

  if (!validTypes.includes(type as ResourceType)) {
    throw new ValidationError("type must be one of: ROOM, EQUIPMENT, LAB.");
  }

  const filtered: Resource[] = [];
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].type === type) {
      filtered.push(resources[i]);
    }
  }
  return filtered;
}

function isRealDate(value: string): boolean {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function timeSlotIsTaken(resourceId: string, start: string, end: string): boolean {
  const newStart = new Date(start).getTime();
  const newEnd = new Date(end).getTime();

  for (let i = 0; i < reservations.length; i++) {
    const r = reservations[i];
    if (r.resourceId !== resourceId) continue;
    if (r.status === "CANCELLED") continue;

    const existingStart = new Date(r.startTime).getTime();
    const existingEnd = new Date(r.endTime).getTime();

    // two time ranges overlap if one starts before the other ends
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }
  return false;
}

export function createReservation(input: ReservationInput): Reservation {
  const resourceId = input.resourceId;
  const userId = input.userId;
  const startTime = input.startTime;
  const endTime = input.endTime;

  if (!resourceId || !userId) {
    throw new ValidationError("resourceId and userId are required.");
  }

  if (!isRealDate(startTime) || !isRealDate(endTime)) {
    throw new ValidationError("startTime and endTime must be valid dates.");
  }

  if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
    throw new ValidationError("startTime must be before endTime.");
  }

  let resourceFound = false;
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].id === resourceId) {
      resourceFound = true;
      break;
    }
  }
  if (!resourceFound) {
    throw new ValidationError("No resource found with id " + resourceId);
  }

  if (timeSlotIsTaken(resourceId, startTime, endTime)) {
    throw new ConflictError("Resource is already reserved for this time slot.");
  }

  const newReservation: Reservation = {
    id: "res-" + randomUUID(),
    resourceId: resourceId,
    userId: userId,
    startTime: startTime,
    endTime: endTime,
    status: "PENDING",
  };

  reservations.push(newReservation);
  return newReservation;
}

export function getActiveReservationsForUser(userId: string): Reservation[] {
  const result: Reservation[] = [];
  for (let i = 0; i < reservations.length; i++) {
    const r = reservations[i];
    if (r.userId === userId && r.status !== "CANCELLED") {
      result.push(r);
    }
  }
  return result;
}
