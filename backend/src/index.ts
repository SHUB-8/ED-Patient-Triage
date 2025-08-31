import express from "express";
import prisma from "./lib/prisma.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import patientRoutes from "./routes/patientRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import {
  initializePriorityQueueFromDB,
  recomputeAllPriorities,
} from "./controllers/priority.controller.js";
import { createServer } from "http";
import { Server } from "socket.io";
import bedRoutes from "./routes/bedRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use("/api/", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/queues", priorityRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/diseases", diseaseRoutes);

io.on("connection", (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await initializePriorityQueueFromDB();
  console.log(`Server is running on port ${PORT}`);

  setInterval(() => {
    console.log("Periodically recomputing priorities and broadcasting...");
    recomputeAllPriorities();
    io.emit("queues_updated");
  }, 60000);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("");
  server.close(() => {
    console.log("Server closed and Prisma client disconnected");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed and Prisma client disconnected");
    process.exit(0);
  });
});
