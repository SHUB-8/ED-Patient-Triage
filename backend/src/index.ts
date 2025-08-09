import express from "express";
import prisma from "./lib/prisma.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import patientRoutes from "./routes/patientRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import { initializePriorityQueueFromDB } from "./controllers/priority.controller.js";

dotenv.config();

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());
app.use("/api/", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/queues", priorityRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  await initializePriorityQueueFromDB();
  console.log(`Server is running on port ${PORT}`);
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
