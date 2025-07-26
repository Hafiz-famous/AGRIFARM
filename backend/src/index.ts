// src/index.ts
// 1) Toujours commencer par les imports
import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import { NextFunction } from "express";

// 2) Importer vos factory functions de routes
import createAnimalsRouter from "./routes/animals"
import createPaddocksRouter from "./routes/paddocks"
import createTasksRouter   from "./routes/tasks"
import movementsRouter     from "./routes/movements"
import treatmentRoutes from './routes/treatments'
import feedingRoutes from './routes/feedings'
import paddockActionRoutes from './routes/paddockActions'
import markersRoutes from './routes/markers'
// 3) Charger les .env avant d’utiliser process.env
dotenv.config()

// 4) Initialiser Express & Prisma
const app    = express()
const prisma = new PrismaClient()

// 5) Middlewares globaux
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
)
app.use(express.json())

// 6) Route de santé
app.get("/", (_req: Request, res: Response) => {
  res.send("🟢 API AgriFarm up and running !")
})

// 7) Monter vos routers en leur passant l’instance Prisma
app.use("/animals", createAnimalsRouter(prisma))
app.use("/paddocks", createPaddocksRouter(prisma))
app.use("/tasks",    createTasksRouter(prisma))
app.use("/movements", movementsRouter)
app.use('/treatments', treatmentRoutes)
app.use('/feedings', feedingRoutes)
app.use('/paddock-actions', paddockActionRoutes)
app.use('/markers', markersRoutes(prisma))
// 8) Gestionnaire 404 générique
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route non trouvée' })
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Erreur non gérée :", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Erreur interne du serveur" });
});
})

// 9) Démarrage
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`→ API listening on http://localhost:${PORT}`))
