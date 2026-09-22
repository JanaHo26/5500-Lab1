export interface HealthStatus {
  status: "ok";
  uptimeSeconds: number;
  timestamp: string;
}

/**
 * Pure business logic for the health check.
 * Knows nothing about Express/HTTP.
 */
export function getHealthStatus(): HealthStatus {
  return {
    status: "ok",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}
