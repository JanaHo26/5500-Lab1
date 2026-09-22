import { Request, Response, NextFunction } from "express";

export interface ErrorResponseBody {
  error: string;
}

/**
 * Centralized Express error-handling middleware.
 * Ensures no unhandled errors leak as raw stack traces.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ErrorResponseBody>,
  _next: NextFunction
): void {
  const message: string = err instanceof Error ? err.message : "Unknown error";
  // eslint-disable-next-line no-console
  console.error(message);
  res.status(500).json({ error: "Internal server error" });
}
