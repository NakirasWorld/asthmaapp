import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";

import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";

const app = express();
app.use(helmet());
app.use(cors({ origin: "*" })); // tighten later
app.use(express.json());
app.use(pinoHttp());

app.get("/health", (_, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
