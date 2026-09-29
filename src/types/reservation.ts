export type ResourceType = "ROOM" | "EQUIPMENT" | "LAB";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  isAvailable: boolean;
}

export interface ReservationInput {
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  id: string;
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
