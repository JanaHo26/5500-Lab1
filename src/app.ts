import express, { Express } from "express";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes";
import reservationRoutes from "./routes/reservation.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use("/api/v1", healthRoutes);
app.use("/api/v1", reservationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CampusHub backend listening on port ${PORT}`);
});

export default app;
